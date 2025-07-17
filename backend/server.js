const { DateTime } = require("luxon");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg"); // Gebruik de PostgreSQL client
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_HASHED_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(cors());

// 📌 Database configuratie voor PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Haal de URL op uit de .env variabele
  ssl: {
    rejectUnauthorized: false, // SSL is verplicht voor Heroku PostgreSQL
  },
});

// 📌 Verbind met de PostgreSQL database
pool
  .connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

// 📌 Nodemailer Setup (Email Notifications)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 Google Calendar API Setup
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendar = google.calendar("v3");

// Decode base64 from env var
const base64Encoded = process.env.GOOGLE_CREDENTIALS_JSON;
const jsonString = Buffer.from(base64Encoded, "base64").toString("utf8");
console.log(jsonString);

const rawCreds = JSON.parse(jsonString);
console.log(rawCreds.private_key);

const auth = new google.auth.GoogleAuth({
  credentials: rawCreds,
  scopes: SCOPES,
});

// 📌 Pricing Configuration
const pricingRanges = [
  { min: 1, max: 24, pricePerAttendee: 4, baseCalculation: 24 },
  { min: 25, max: 49, pricePerAttendee: 3, baseCalculation: 49 },
  { min: 50, max: 74, pricePerAttendee: 3, baseCalculation: 74 },
  { min: 75, max: 99, pricePerAttendee: 3, baseCalculation: 99 },
  { min: 100, max: 124, pricePerAttendee: 3, baseCalculation: 124 },
  { min: 125, max: 149, pricePerAttendee: 3, baseCalculation: 149 },
  { min: 150, max: 174, pricePerAttendee: 3, baseCalculation: 174 },
  { min: 175, max: 200, pricePerAttendee: 3, baseCalculation: 200 },
];
const TRANSPORT_FEE = 20;

// 📌 Calculate Price Function
const calculatePrice = (attendees) => {
  const range = pricingRanges.find(
    (r) => attendees >= r.min && attendees <= r.max
  );
  return range
    ? range.baseCalculation * range.pricePerAttendee + TRANSPORT_FEE
    : null;
};

// 📌 API: Get Pricing Options
app.get("/pricing", (req, res) => res.json(pricingRanges));

app.post("/book", async (req, res) => {
  const {
    name,
    email,
    location,
    startDateTime,
    endDateTime,
    attendees,
    attendeeRange,
  } = req.body;
  const price = calculatePrice(attendees);
  if (!price) return res.status(400).json({ error: "Invalid attendee count" });

  try {
    const result = await pool.query(
      "INSERT INTO bookings (name, email, location, start_datetime, end_datetime, status, price, attendee_range) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        name,
        email,
        location,
        startDateTime,
        endDateTime,
        "pending",
        attendeeRange,
      ]
    );

    // ✅ Send confirmation email
    const subject = "Offerteaanvraag ontvangen – Pierino";
    const text = `Bedankt ${name}, we hebben je aanvraag ontvangen voor een ijskar op ${location}. We sturen binnen 24u een voorstel.`;

    const emailBody = `
      <h3>Offerteaanvraag Bevestiging</h3>
      <p>Beste ${name},</p>
      <p>Bedankt voor je aanvraag voor een ijskar op <strong>${location}</strong>.</p>
      <p>Wij bekijken je aanvraag en sturen binnen de 24u een voorstel terug.</p>
      <p><strong>Datum:</strong> ${new Date(
        startDateTime
      ).toLocaleString()} – ${new Date(endDateTime).toLocaleString()}</p>
      <p><strong>Aantal personen:</strong> ${attendeeRange}</p>
      <br/>
      <p>Met vriendelijke groet,<br>Team Pierino</p>
    `;

    await transporter.sendMail({
      from: `"Pierino Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text,
      html: emailBody,
    });

    await transporter.sendMail({
      from: `"Pierino Notificaties" <${process.env.EMAIL_USER}>`,
      to: "pierino.reservaties@gmail.com",
      subject: "❗ Nieuwe Offerteaanvraag - Actie vereist",
      text: `${name} heeft een nieuwe offerteaanvraag ingediend.`,
      html: `
        <h2 style="color: red;">❗ Nieuwe Offerteaanvraag</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Locatie:</strong> ${location}</p>
        <p><strong>Datum:</strong> ${new Date(
          startDateTime
        ).toLocaleString()} – ${new Date(endDateTime).toLocaleString()}</p>
        <p><strong>Aantal personen:</strong> ${attendeeRange}</p>
        <p><strong>Geschatte prijs:</strong> €${price}</p>
        <p style="color: red; font-weight: bold;">⚠️ Controleer deze aanvraag zo snel mogelijk!</p>
      `,
      headers: {
        "X-Priority": "1", // 1 = Highest priority
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    });

    res.json({
      success: true,
      message:
        "Booking submitted! You will receive a quotation (offerte) from us within 24 hours. Please also check your spam folder.",
      price,
    });
  } catch (error) {
    console.error("❌ Booking submission failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Fetch Pending Bookings
app.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");

    // 👇 Format timestamps naar ISO string met lokale tijd (Europe/Brussels)
    const formattedBookings = result.rows.map((booking) => ({
      ...booking,
      start_datetime: new Date(booking.start_datetime).toISOString(), // blijf consistent in UTC, laat frontend het omzetten
      end_datetime: new Date(booking.end_datetime).toISOString(),
    }));

    res.json(formattedBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const match = await bcrypt.compare(password, ADMIN_PASSWORD);
  if (!match) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // ✅ Create JWT token
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  // ✅ Send token to frontend
  res.status(200).json({
    message: "Login successful",
    token,
  });
});

// 📌 API: Approve or Decline Booking
app.post("/update-booking", async (req, res) => {
  const { id, status, message } = req.body; // Added 'message' to capture the optional message
  if (!["approved", "declined"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    // Fetch the booking from PostgreSQL
    const bookingQuery = "SELECT * FROM bookings WHERE id = $1"; // Gebruik $1 voor parameterbinding
    const bookingResult = await pool.query(bookingQuery, [id]);

    if (bookingResult.rows.length === 0)
      return res.status(404).json({ error: "Booking not found" });

    // Update booking status
    const updateQuery = "UPDATE bookings SET status = $1 WHERE id = $2"; // Gebruik $1 en $2 voor parameterbinding
    await pool.query(updateQuery, [status, id]);

    const { email, name, location, start_datetime, end_datetime } =
      bookingResult.rows[0];

    let subject, text;

    if (status === "approved") {
      subject = "Booking Approved!";
      text = message
        ? `Hello ${name}, your booking at ${location} has been approved! Additional Message: ${message}`
        : `Hello ${name}, your booking at ${location} has been approved! The Pierino Team thanks you.`;

      emailBody = `
        <h3>Booking Approved</h3>
        <p>Dear ${name},</p>
        <p>Your booking at <strong>${location}</strong> has been approved!</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <p>We look forward to serving you.</p>
        <p>Kind regards,<br>The Pierino Team</p>
      `;

      // Add event to Google Calendar
      console.log("📅 Voeg toe aan Google Calendar...");
      await addToGoogleCalendar(name, location, start_datetime, end_datetime);

      // Send confirmation email to client
      console.log("📨 Verstuur bevestigingsmail naar klant...");
      await sendConfirmationEmail(
        name,
        email,
        location,
        start_datetime,
        end_datetime,
        message
      );

      // Send confirmation email to admin
      console.log("📨 Verstuur bevestiging naar admin...");
      await sendConfirmationEmailToAdmin(
        name,
        email,
        location,
        start_datetime,
        end_datetime
      );
    } else {
      subject = "Pierino Booking Declined ";
      text = `Hello ${name}, unfortunately, your booking at ${location} has been declined.`;
      emailBody = `
      <h3>Booking Declined</h3>
      <p>Dear ${name},</p>
      <p>Thank you for your interest in booking at <strong>${location}</strong>.</p>
      <p>Unfortunately, we are unable to accommodate your booking at this time.</p> 
      <p>You are very welcome to submit a new booking request for a different date or time.</p><br>
      <p>If you have any questions or need assistance, please feel free to contact us.</p><br>
      <p>Kind regards,<br>The Pierino Team</p>
    `;
    }

    // Send email to the client
    await transporter.sendMail({
      from: `"Pierino Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text,
      html: emailBody,
    });

    res.json({ success: true, message: `Booking ${status}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Update Booking Price
app.put("/bookings/:id/price", async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (!price || isNaN(price)) {
    return res.status(400).json({ error: "Invalid price value." });
  }

  try {
    const result = await pool.query(
      "UPDATE bookings SET price = $1 WHERE id = $2 AND status = 'pending' RETURNING *",
      [price, id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Pending booking not found or already processed." });
    }

    res.json({
      success: true,
      message: "Price updated successfully.",
      updated: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Update Booking End Time
app.put("/bookings/:id/endtime", async (req, res) => {
  const { id } = req.params;
  const { end_datetime } = req.body;

  if (!end_datetime || isNaN(new Date(end_datetime).getTime())) {
    return res.status(400).json({ error: "Invalid end_datetime value." });
  }

  try {
    const result = await pool.query(
      "UPDATE bookings SET end_datetime = $1 WHERE id = $2 AND status = 'pending' RETURNING *",
      [end_datetime, id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Pending booking not found or already processed." });
    }

    res.json({
      success: true,
      message: "End time updated successfully.",
      updated: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Send Offer Mail
app.post("/send-offer", async (req, res) => {
  const { id } = req.body;

  try {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = result.rows[0];
    const { name, email, location, start_datetime, end_datetime, price } =
      booking;

    await sendOfferMail(
      name,
      email,
      location,
      start_datetime,
      end_datetime,
      price
    );

    res.json({ success: true, message: "Offerte verzonden." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Delete Booking
app.delete("/delete-booking/:id", async (req, res) => {
  const { id } = req.params;
  let eventRemoved = false;

  try {
    // Check if booking exists in PostgreSQL
    const bookingQuery = "SELECT * FROM bookings WHERE id = $1"; // Gebruik $1 voor parameterbinding
    const bookingResult = await pool.query(bookingQuery, [id]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const { status, start_datetime, end_datetime, name, location } =
      bookingResult.rows[0];

    // Delete from database
    const deleteQuery = "DELETE FROM bookings WHERE id = $1"; // Gebruik $1 voor parameterbinding
    await pool.query(deleteQuery, [id]);

    console.log("Status from DB:", status);
    console.log("Start:", start_datetime);
    console.log("End:", end_datetime);
    console.log("Name:", name);
    console.log("Location:", location);

    // If booking was approved, remove it from Google Calendar
    if (status === "approved" || status === "Approved") {
      eventRemoved = await removeFromGoogleCalendar(
        name,
        location,
        start_datetime,
        end_datetime
      );
    }

    // Check if the table is now empty and reset the auto-increment ID
    const remainingBookingsQuery = "SELECT COUNT(*) AS count FROM bookings"; // Query om het aantal boekingen te tellen
    const remainingBookingsResult = await pool.query(remainingBookingsQuery);
    if (remainingBookingsResult.rows[0].count === 0) {
      // PostgreSQL heeft geen 'DBCC CHECKIDENT', maar als je een sequence hebt voor je Id, kun je de sequence resetten
      await pool.query("ALTER SEQUENCE bookings_id_seq RESTART WITH 1");
    }

    res.json({
      success: true,
      message: "Booking deleted successfully.",
      eventRemoved,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Function: Remove Event from Google Calendar
const removeFromGoogleCalendar = async (
  name,
  location,
  startDateTime,
  endDateTime
) => {
  try {
    const authClient = await auth.getClient();
    const calendarId =
      "9f77cf8e6dd08b5b4c921d6a6d181e61f519ad55eab6a08fdf584361307dcc62@group.calendar.google.com";

    // Search for the event
    const events = await calendar.events.list({
      auth: authClient,
      calendarId,
      q: `Booking by ${name}`,
    });

    const eventToDelete = events.data.items.find((event) => {
      return (
        event.summary === `Booking by ${name}` &&
        new Date(event.start.dateTime).toISOString() ===
          new Date(startDateTime).toISOString() &&
        new Date(event.end.dateTime).toISOString() ===
          new Date(endDateTime).toISOString()
      );
    });

    if (eventToDelete) {
      await calendar.events.delete({
        auth: authClient,
        calendarId,
        eventId: eventToDelete.id,
      });
      console.log("✅ Event removed from Google Calendar.");
      return true; // Indicate that event was removed
    } else {
      console.log("⚠️ No matching event found in Google Calendar.");
      return false;
    }
  } catch (error) {
    console.error("❌ Error removing from Google Calendar:", error);
    return false;
  }
};

// 📌 Function: Add Event to Google Calendar
const addToGoogleCalendar = async (
  name,
  location,
  startDateTime,
  endDateTime
) => {
  console.log("📥 addToGoogleCalendar was called with:", {
    name,
    location,
    startDateTime,
    endDateTime,
  });
  try {
    console.log("Adding event to Google Calendar with the following details:");
    console.log({ name, location, startDateTime, endDateTime });

    const authClient = await auth.getClient();
    const calendarId =
      "9f77cf8e6dd08b5b4c921d6a6d181e61f519ad55eab6a08fdf584361307dcc62@group.calendar.google.com"; // Use 'primary' for the default calendar

    // Interpreteer de string/timestamp als lokale tijd in Brussels
    const start = DateTime.fromJSDate(startDateTime).setZone("Europe/Brussels");
    const end = DateTime.fromJSDate(endDateTime).setZone("Europe/Brussels");

    console.log("typeof startDateTime:", typeof startDateTime);
    console.log("typeof endDateTime:", typeof endDateTime);
    console.log("🧪 Parsed start:", start.toString());
    console.log("🧪 Parsed end:", end.toString());

    // Event object
    const event = {
      summary: `Booking by ${name}`,
      description: `Email: ${name}\nLocation: ${location}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "UTC",
      },
    };

    // Insert the event into Google Calendar
    const response = await calendar.events.insert({
      auth: authClient,
      calendarId: calendarId,
      requestBody: event,
    });

    console.log("Event added to Google Calendar:", response.data);
    console.log("start.toISO():", start.toISO());
    console.log("start.toUTC().toISO():", start.toUTC().toISO());
    console.log("start.toFormat('HH:mm ZZZZ'):", start.toFormat("HH:mm ZZZZ"));
  } catch (error) {
    console.error("❌ Google Calendar Error:", error);
  }
};

// 📌 Function: Send Confirmation Email to Client
const sendConfirmationEmail = async (
  name,
  email,
  location,
  startDateTime,
  endDateTime,
  message
) => {
  const emailSubject = `Booking Confirmation - ${name}`;
  const emailBody = `
     
      <p>Dear ${name},</p>
      <p>Thank you for your booking. Here are the details:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Date:</strong> ${new Date(startDateTime).toLocaleDateString(
          "en-GB"
        )}</li>
        <li><strong>Start Time:</strong> ${new Date(
          startDateTime
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}</li>
        <li><strong>End Time:</strong> ${new Date(
          endDateTime
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}</li>
      </ul>
      <p>${message || "The Pierino Team thanks you."}</p>
      <p>You can view your event in your Google Calendar: <a href="https://calendar.google.com/calendar/r/eventedit?text=Booking+by+${name}&dates=${new Date(
    startDateTime
  )
    .toISOString()
    .replace(/[-:]/g, "")}/${new Date(endDateTime)
    .toISOString()
    .replace(
      /[-:]/g,
      ""
    )}&location=${location}" target="_blank">View Event</a></p>
      <p>Thank you!</p>
    `;

  // Send email to the client
  await transporter.sendMail({
    from: '"Pierino Team" <pierino.reservaties@gmail.com>',
    to: email,
    subject: emailSubject,
    html: emailBody,
  });
};

// 📌 Function: Send Offer Mail
const sendOfferMail = async (
  name,
  email,
  location,
  startDateTime,
  endDateTime,
  price
) => {
  const subject = `Offerte Pierino voor ${name} reservatie-aanvraag`;

  const body = `
    Beste ${name},<br><br>
    Voor jouw aanvraag om reservatie op <strong>${new Date(
      startDateTime
    ).toLocaleString("nl-BE")}</strong> te <strong>${location}</strong>,<br>
    voorzien wij een prijs van <strong>€${price}</strong>.<br><br>

    Voor deze reservatie voorzien wij een eindtijd van <strong>${new Date(
      endDateTime
    ).toLocaleString("nl-BE")}</strong>.<br><br>

    Deze prijs is inclusief afstandsvergoeding en het voorzien van de gepaste hoeveelheid ijs. <br> <br>

    Gelieve te reageren op deze mail ter bevestiging van dit voorstel.<br><br>
    
    Het Pierino Team dankt u.
  `;

  await transporter.sendMail({
    from: '"Pierino Team" <pierino.reservaties@gmail.com>',
    to: email,
    subject,
    html: body,
  });
};

// 📌 Function: Send Confirmation Email to Admin (Yourself)
const sendConfirmationEmailToAdmin = async (
  name,
  email,
  location,
  startDateTime,
  endDateTime
) => {
  const emailSubject = `New Booking - ${name}`;
  const emailBody = `
      <h3>New Booking</h3>
      <p>Dear Admin,</p>
      <p>A new booking has been confirmed. Here are the details:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Date:</strong> ${new Date(startDateTime).toLocaleDateString(
          "en-GB"
        )}</li>
        <li><strong>Start Time:</strong> ${new Date(
          startDateTime
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}</li>
        <li><strong>End Time:</strong> ${new Date(
          endDateTime
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}</li>
      </ul>
      <p>Thank you!</p>
    `;

  // Send email to the admin (your email)
  await transporter.sendMail({
    from: '"Pierino Team" <pierino.reservaties@gmail.com>',
    to: "pierino.reservaties@gmail.com", // You can set an environment variable for admin email
    subject: emailSubject,
    html: emailBody,
  });
};

// 📌 Serve React frontend (build folder)
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
// 📌 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
