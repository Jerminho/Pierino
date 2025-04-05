require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg"); // Gebruik de PostgreSQL client
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// 📌 Database configuratie voor PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Haal de URL op uit de .env variabele
  ssl: {
    rejectUnauthorized: false,  // SSL is verplicht voor Heroku PostgreSQL
  },
});

// 📌 Verbind met de PostgreSQL database
pool.connect()
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
const serviceAccountKey = require("./pierino-test-a0771b4cab8f.json");
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
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

// 📌 API: Submit a Booking
app.post("/book", async (req, res) => {
  const { name, email, location, startDateTime, endDateTime, attendees } =
    req.body;
  const price = calculatePrice(attendees);
  if (!price) return res.status(400).json({ error: "Invalid attendee count" });

  try {
    const result = await pool.query(
      "INSERT INTO Bookings (Name, Email, Location, StartDateTime, EndDateTime, Status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, location, startDateTime, endDateTime, "pending"]
    );

    res.json({ success: true, message: "Booking submitted!", price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Fetch Pending Bookings
app.get("/bookings", async (req, res) => {
  try {
    let result = await pool.query("SELECT * FROM Bookings ");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Approve or Decline Booking
app.post("/update-booking", async (req, res) => {
  const { id, status, message } = req.body; // Added 'message' to capture the optional message
  if (!["approved", "declined"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    // Fetch the booking from PostgreSQL
    const bookingQuery = "SELECT * FROM Bookings WHERE Id = $1"; // Gebruik $1 voor parameterbinding
    const bookingResult = await pool.query(bookingQuery, [id]);

    if (bookingResult.rows.length === 0)
      return res.status(404).json({ error: "Booking not found" });

    // Update booking status
    const updateQuery = "UPDATE Bookings SET Status = $1 WHERE Id = $2"; // Gebruik $1 en $2 voor parameterbinding
    await pool.query(updateQuery, [status, id]);

    const { Email, Name, Location, StartDateTime, EndDateTime } = bookingResult.rows[0];

    let subject, text;

    if (status === "approved") {
      subject = "🎉 Booking Approved!";
      text = message
        ? `Hello ${Name}, your booking at ${Location} has been approved! Additional Message: ${message}`
        : `Hello ${Name}, your booking at ${Location} has been approved! The Pierino team thanks you.`;

      // Add event to Google Calendar
      await addToGoogleCalendar(Name, Location, StartDateTime, EndDateTime);

      // Send confirmation email to client
      await sendConfirmationEmail(Name, Email, Location, StartDateTime, EndDateTime, message);

      // Send confirmation email to admin
      await sendConfirmationEmailToAdmin(Name, Email, Location, StartDateTime, EndDateTime);
    } else {
      subject = "❌ Booking Declined";
      text = `Hello ${Name}, unfortunately, your booking at ${Location} has been declined.`;
    }

    // Send email to the client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: Email,
      subject,
      text,
    });

    res.json({ success: true, message: `Booking ${status}.` });
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
    const bookingQuery = "SELECT * FROM Bookings WHERE Id = $1"; // Gebruik $1 voor parameterbinding
    const bookingResult = await pool.query(bookingQuery, [id]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const { Status, StartDateTime, EndDateTime, Name, Location } = bookingResult.rows[0];

    // Delete from database
    const deleteQuery = "DELETE FROM Bookings WHERE Id = $1"; // Gebruik $1 voor parameterbinding
    await pool.query(deleteQuery, [id]);

    // If booking was approved, remove it from Google Calendar
    if (Status === "approved") {
      eventRemoved = await removeFromGoogleCalendar(
        Name,
        Location,
        StartDateTime,
        EndDateTime
      );
    }

    // Check if the table is now empty and reset the auto-increment ID
    const remainingBookingsQuery = "SELECT COUNT(*) AS count FROM Bookings"; // Query om het aantal boekingen te tellen
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
      "3203d2e4dc7bb4918cd9263a49a2c17e6f4f1286aa400dd35e4e9dca0262fc0f@group.calendar.google.com";

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
  try {
    console.log("Adding event to Google Calendar with the following details:");
    console.log({ name, location, startDateTime, endDateTime });

    const authClient = await auth.getClient();
    const calendarId =
      "3203d2e4dc7bb4918cd9263a49a2c17e6f4f1286aa400dd35e4e9dca0262fc0f@group.calendar.google.com"; // Use 'primary' for the default calendar

    // Event object
    const event = {
      summary: `Booking by ${name}`,
      description: `Email: ${name}\nLocation: ${location}`,
      start: {
        dateTime: new Date(startDateTime).toISOString(),
        timeZone: "Europe/Brussels",
      },
      end: {
        dateTime: new Date(endDateTime).toISOString(),
        timeZone: "Europe/Brussels",
      },
    };

    // Insert the event into Google Calendar
    const response = await calendar.events.insert({
      auth: authClient,
      calendarId: calendarId,
      requestBody: event,
    });

    console.log("Event added to Google Calendar:", response.data);
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
      <h3>Booking Confirmation</h3>
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
      <p>${message || "The Pierino team thanks you."}</p>
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
    from: '"NH-Test" <njinehappypierre@gmail.com>',
    to: email,
    subject: emailSubject,
    html: emailBody,
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
    from: '"NH-Test" <njinehappypierre@gmail.com>',
    to: "njinehappypierre@gmail.com", // You can set an environment variable for admin email
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
