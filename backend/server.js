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
    (r) => attendees >= r.min && attendees <= r.max,
  );
  return range
    ? range.baseCalculation * range.pricePerAttendee + TRANSPORT_FEE
    : null;
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // Attach user data (e.g., username)
    next();
  });
}

// 📌 API: Get Pricing Options
app.get("/pricing", (req, res) => res.json(pricingRanges));

app.post("/book", async (req, res) => {
  const {
    name,
    email,
    phone,
    location,
    startDateTime,
    // endDateTime,
    attendees,
    attendeeRange,
    commentary,
    wantsInvoice,
    invoiceVAT,
    invoiceName,
    invoiceAddress,
  } = req.body;
  const price = calculatePrice(attendees);
  if (!price) return res.status(400).json({ error: "Invalid attendee count" });

  try {
    const result = await pool.query(
      "INSERT INTO bookings (name, email, phone, location, start_datetime, status, price, attendees, attendee_range, commentary, wants_invoice, invoice_vat, invoice_name, invoice_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [
        name,
        email,
        phone,
        location,
        startDateTime,
        // endDateTime,
        "pending",
        price,
        parseInt(attendees, 10),
        attendeeRange,
        commentary || null,
        wantsInvoice || false,
        invoiceVAT || null,
        invoiceName || null,
        invoiceAddress || null,
      ],
    );

    // ✅ Send confirmation email
    const subject = "Bevestiging van je offerteaanvraag – Pierino Ijs";
    const formattedDate = DateTime.fromJSDate(new Date(startDateTime))
      .setZone("Europe/Brussels")
      .toFormat("dd/LL/yyyy HH:mm");

    const text = `Beste ${name},

Bedankt voor je aanvraag voor een ijskar op ${location}. We hebben je aanvraag goed ontvangen en ons team bekijkt momenteel alle details.

Binnen de 24 uur ontvang je van ons een persoonlijk voorstel. Heb je in de tussentijd vragen of aanvullingen? Je mag ons altijd contacteren door deze e-mail te beantwoorden.

Met vriendelijke groeten,  
Team Pierino`;

    const emailBody = `
  <h3>Bevestiging offerteaanvraag – Pierino Ijs</h3>
  <p>Beste ${name},</p>

  <p>Hartelijk dank voor uw aanvraag voor een ijskar op <strong>${location}</strong>. We hebben uw aanvraag goed ontvangen.</p>

  <p>Ons team bekijkt momenteel alle details en zal u binnen de <strong>24 uur</strong> een voorstel toesturen.</p>

  <p><strong>Datum van het evenement:</strong> ${formattedDate}</p>
  <p><strong>Geschat aantal personen:</strong> ${attendeeRange}</p>

  <p>Heeft u in de tussentijd nog vragen of extra info? Aarzel dan niet om ons te contacteren.</p>

  <br/>
  <p>Met vriendelijke groeten,<br>Team Pierino</p>
  <p style="font-size: 0.9em; color: #666;">Ijskarren · Feesten · Bedrijfsevents · En meer!</p>
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
        <p><strong>Telefoonnummer:</strong> ${phone}</p>
        <p><strong>Locatie:</strong> ${location}</p>
        <p><strong>Datum:</strong> ${formattedDate}</p>
        <p><strong>Aantal personen:</strong> ${attendeeRange}</p> <br/>
        ${
          wantsInvoice
            ? `
      <h4>Facturatiegegevens</h4>
      <p><strong>BTW-nummer:</strong> ${invoiceVAT}</p>
      <p><strong>Bedrijfsnaam:</strong> ${invoiceName}</p>
      <p><strong>Adres:</strong> ${invoiceAddress}</p>
    `
            : `<p><strong>Factuur gewenst:</strong> Nee</p>`
        }

        <p><strong>Geschatte prijs:</strong> €${price}</p>
        <p><strong>Opmerking klant:</strong> ${commentary || "Geen"}</p>
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
        "Uw reservering is succesvol verzonden! Binnen 24 uur ontvangt u een offerte van ons. Mail niet ontvangen? Check zeker eens uw spamfolder.",
      price,
    });
  } catch (error) {
    console.error("❌ Booking submission failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 API: Fetch Pending Bookings
app.get("/bookings", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");

    // 👇 Format timestamps naar ISO string met lokale tijd (Europe/Brussels)
    const formattedBookings = result.rows.map((booking) => ({
      ...booking,
      start_datetime: new Date(booking.start_datetime).toISOString(), // blijf consistent in UTC, laat frontend het omzetten
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

    // 3️⃣ Haal alle benodigde gegevens uit booking
    const {
      email,
      name,
      location,
      start_datetime,
      phone,
      attendee_range,
      commentary,
      wants_invoice,
      invoice_vat,
      invoice_name,
      invoice_address,
      transport_fee, // ✅ nieuw
      duration, // ✅ nieuw
      price,
    } = bookingResult.rows[0];

    let subject, text;

    if (status === "approved") {
      subject = "Pierino Reservatie bevestigd!";
      text = message
        ? `Beste ${name}, uw reservatie bij ${location} is aanvaard! Extra bericht: ${message}`
        : `Beste ${name}, uw reservatie bij ${location} is aanvaard! Het Pierino Team dankt u.`;

      emailBody = `
        <h3>Pierino Reservatie bevestigd</h3>
        <p>Beste ${name},</p>
        <p>Uw reservatie op <strong>${location}</strong> werd aanvaard!</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <p>We kijken ernaar uit jullie te bedienen.</p>
        <p>Met vriendelijke groeten,<br>Team Pierino</p>
  <p style="font-size: 0.9em; color: #666;">Ijskarren · Feesten · Bedrijfsevents · En meer!</p>
      `;

      // Add event to Google Calendar
      console.log("📅 Voeg toe aan Google Calendar...");
      await addToGoogleCalendar(
        name,
        location,
        start_datetime,
        phone,
        email,
        attendee_range,
        commentary,
        wants_invoice,
        invoice_vat,
        invoice_name,
        invoice_address,
        transport_fee, // ✅ nieuw
        duration, // ✅ nieuw
        price,
      );

      // Send confirmation email to client
      console.log("📨 Verstuur bevestigingsmail naar klant...");
      await sendConfirmationEmail(
        name,
        email,
        location,
        start_datetime,
        message,
      );

      // Send confirmation email to admin
      console.log("📨 Verstuur bevestiging naar admin...");
      await sendConfirmationEmailToAdmin(name, email, location, start_datetime);
    } else {
      subject = "Pierino Reservering Geweigerd";
      emailBody = `
  <h3>Reservering Geweigerd</h3>
  <p>Beste ${name},</p>
  <p>Bedankt voor uw interesse om te reserveren bij Pierino-ijs op locatie: <strong>${location}</strong>.</p>
  <p>Helaas kunnen we uw reservering op dit moment niet accepteren.</p>
  <p>U bent uiteraard welkom om een nieuwe reserveringsaanvraag in te dienen voor een andere datum of tijd.</p><br>
  <p>Als u vragen hebt of hulp nodig hebt, neem gerust contact met ons op.</p><br>
  <p>Met vriendelijke groeten,<br>Team Pierino</p>
  <p style="font-size: 0.9em; color: #666;">Ijskarren · Feesten · Bedrijfsevents · En meer!</p>
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
      [price, id],
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

// 1. Endpoint voor het aanpassen van de locatie
app.put('/bookings/:id/location', async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  try {
    // Let op: als jouw database-variabele geen 'pool' of 'db' heet, pas dit dan aan
    await pool.query('UPDATE bookings SET location = $1 WHERE id = $2', [location, id]);
    res.json({ success: true, message: "Location updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// // 📌 API: Update Booking End Time
// app.put("/bookings/:id/endtime", async (req, res) => {
//   const { id } = req.params;
//   const { end_datetime } = req.body;

//   if (!end_datetime || isNaN(new Date(end_datetime).getTime())) {
//     return res.status(400).json({ error: "Invalid end_datetime value." });
//   }

//   try {
//     const result = await pool.query(
//       "UPDATE bookings SET end_datetime = $1 WHERE id = $2 AND status = 'pending' RETURNING *",
//       [end_datetime, id]
//     );

//     if (result.rowCount === 0) {
//       return res
//         .status(404)
//         .json({ error: "Pending booking not found or already processed." });
//     }

//     res.json({
//       success: true,
//       message: "End time updated successfully.",
//       updated: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// 📌 API: Send Offer Mail
app.post("/send-offer", async (req, res) => {
  const { id, message, transportFee, duration } = req.body;

  try {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = result.rows[0];
    const { name, email, location, start_datetime, price } = booking;

    await sendOfferMail(
      name,
      email,
      location,
      start_datetime,
      price,
      transportFee,
      duration,
      message,
    );

    // ✅ Sla transport_fee, duration en offer_sent meteen op in de DB
    await pool.query(
      "UPDATE bookings SET transport_fee = $1, duration = $2, offer_sent = true WHERE id = $3",
      [transportFee, duration, id],
    );

    res.json({ success: true, message: "Offerte verzonden." });
  } catch (error) {
    console.error("Error sending offer:", error);
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

    const { status, start_datetime, name, location } = bookingResult.rows[0];

    // Delete from database
    const deleteQuery = "DELETE FROM bookings WHERE id = $1"; // Gebruik $1 voor parameterbinding
    await pool.query(deleteQuery, [id]);

    console.log("Status from DB:", status);
    console.log("Start:", start_datetime);
    // console.log("End:", end_datetime);
    console.log("Name:", name);
    console.log("Location:", location);

    // If booking was approved, remove it from Google Calendar
    if (status === "approved" || status === "Approved") {
      eventRemoved = await removeFromGoogleCalendar(
        name,
        location,
        start_datetime,
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
  // endDateTime
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
          new Date(startDateTime).toISOString()
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

const addToGoogleCalendar = async (
  name,
  location,
  startDateTime,
  phone,
  email,
  attendeeRange,
  commentary,
  wantsInvoice,
  invoiceVAT,
  invoiceName,
  invoiceAddress,
  transport_fee,
  duration,
  price,
) => {
  console.log("📥 addToGoogleCalendar was called with:", {
    name,
    location,
    startDateTime,
    phone,
    email,
    attendeeRange,
    commentary,
    wantsInvoice,
    invoiceVAT,
    invoiceName,
    invoiceAddress,
    transport_fee,
    duration,
    price,
  });

  try {
    const authClient = await auth.getClient();
    const calendarId =
      "9f77cf8e6dd08b5b4c921d6a6d181e61f519ad55eab6a08fdf584361307dcc62@group.calendar.google.com";

    const start = DateTime.fromJSDate(startDateTime).setZone("Europe/Brussels");
    const end = start.plus({ hours: 1 });

    const totalPrice = Number(price || 0);
    const transportFee = Number(transport_fee || 0);
    const icePrice = totalPrice - transportFee;
    // 📌 Compose a rich event description
    const description = `
📌 *Nieuwe offerteaanvraag*

👤 Naam: ${name}
📧 Email: ${email}
📞 Telefoon: ${phone}
📍 Locatie: ${location}
📅 Datum: ${start.toFormat("dd/LL/yyyy HH:mm")}
👥 Aantal personen: ${attendeeRange}
🗒️ Opmerking: ${commentary || "Geen"}

*FINANCIËLE AFREKENING (BELANGRIJK VOOR CHAUFFEUR)* 
--------------------------------------------------
💰 Minimum totaalprijs: €${totalPrice || "Niet opgegeven"}
🍦 Waarvan ijs: €${icePrice || "Niet opgegeven"}
🚚 Waarvan transport: €${transportFee || "Niet opgegeven"}
⏱️ Duur: ${duration || 60} minuten
--------------------------------------------------

🧾 Facturatie:
${
  wantsInvoice
    ? `BTW-nummer: ${invoiceVAT || "Niet opgegeven"}
Bedrijfsnaam: ${invoiceName || "Niet opgegeven"}
Adres: ${invoiceAddress || "Niet opgegeven"}`
    : "Geen factuur gevraagd"
}
    `.trim();

    const event = {
      summary: `Booking by ${name}`,
      description,
      start: {
        dateTime: start.toISO(),
        timeZone: "Europe/Brussels",
      },
      end: {
        dateTime: end.toISO(),
        timeZone: "Europe/Brussels",
      },
    };

    const response = await calendar.events.insert({
      auth: authClient,
      calendarId,
      requestBody: event,
    });

    console.log("✅ Event added to Google Calendar:", response.data);
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
  // endDateTime,
  message,
) => {
  // 🕒 Formatteert alles in één keer: "21/04/2026 15:19"
  const fullDateTimeFormatted = DateTime.fromJSDate(new Date(startDateTime))
    .setZone("Europe/Brussels")
    .toFormat("dd/LL/yyyy HH:mm");

  const emailSubject = `Pierino Reservatiebevestiging- ${name}`;
  const emailBody = `
     
      <p>Beste ${name},</p>
      <p>Bedankt voor uw reservatie. Hier zijn de details:</p>
      <ul>
        <li><strong>Naam:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Locatie:</strong> ${location}</li>
        <li><strong>Datum & Tijd:</strong> ${fullDateTimeFormatted}</li>
        
      </ul>
      <p>${message || "Bedankt voor uw vertrouwen."}</p>
      <p>
  <p>
  Bekijk uw evenement hier: 
  <a href="https://calendar.google.com/calendar/r/eventedit?text=Booking+by+${name}&dates=${new Date(startDateTime).toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").split(".")[0]}Z&location=${encodeURIComponent(location)}&ctz=Europe/Brussels" target="_blank">
    View Event
  </a>
</p>

      <br>
    
  <p>Met vriendelijke groeten,<br>Team Pierino</p>
  <p style="font-size: 0.9em; color: #666;">Ijskarren · Feesten · Bedrijfsevents · En meer!</p>
    `;

  // Send email to the client
  await transporter.sendMail({
    from: '"Pierino Team" <pierino.reservaties@gmail.com>',
    to: email,
    subject: emailSubject,
    html: emailBody,
  });
};

// 📌 Function: Send Offer Mail (with transportFee + duration + optional message)
const sendOfferMail = async (
  name,
  email,
  location,
  startDateTime,
  price,
  transportFee,
  duration,
  message,
) => {
  // ⏱️ Format duration from minutes → "X uur en Y minuten"
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  let durationText = "";
  if (hours > 0) durationText += `${hours} uur`;
  if (minutes > 0)
    durationText += `${hours > 0 ? " en " : ""}${minutes} minuten`;

  // 🕒 De Luxon methode die je voorstelde:
  const formattedDate = DateTime.fromJSDate(new Date(startDateTime))
    .setZone("Europe/Brussels")
    .toFormat("dd/LL/yyyy HH:mm");
  const subject = `Offerte Pierino voor ${name} reservatie-aanvraag`;
  const icePrice = Number(price || 0) - Number(transportFee || 0);

const body = `
  Geachte ${name},<br><br>

  Alvast dank om aan Pierino-ijs te denken!<br><br>

  Dit zou mogelijk zijn voor de minimumprijs van <strong>€${price}</strong>.<br><br>

  In deze prijs is <strong>€${icePrice}</strong> voorzien aan ijs.<br><br>

  De prijs voor 1 bol bedraagt 3 euro, 2 bollen 5 euro, 3 bollen 6 euro.<br><br>

  Er wordt een verplaatsingskost aangerekend van <strong>€${transportFee}</strong>, deze is reeds verrekend in het minimumbedrag.<br><br>

  Wij voorzien een tijdsduur van <strong>${durationText}</strong> om al uw genodigden op een rustige manier te bedienen.<br><br>

  De betaling zou cash/bankcontact na het bedienen van de genodigden mogen gebeuren indien mogelijk.<br><br>

  Bij bevestiging graag een bereikbaar gsm-nummer voor die dag.<br><br>

  Ik hoop u hiermee voldoende geïnformeerd te hebben, indien u nog vragen heeft zet ze gerust op mail!<br><br>

  Dit voorstel is 2 weken geldig, rekening houdend met komende en lopende aanvragen.<br><br>

  Aanvragen voor feesten of evenementen worden enkel via mail afgewerkt.<br><br>

  ${message ? `<p>${message}</p><br>` : ""}

  <p>Met vriendelijke groeten,<br>Team Pierino</p>
  <p style="font-size: 0.9em; color: #666;">Ijskarren · Feesten · Bedrijfsevents · En meer!</p>
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
  // endDateTime
) => {
  const emailSubject = `Nieuwe reservatie - ${name}`;
  const emailBody = `
      <p>Dear Admin,</p>
      <p>Er werd zojuist een nieuwe reservatie bevestigd. Hier zijn de details:</p>
      <ul>
        <li><strong>Naam:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Locatie:</strong> ${location}</li>
        <li><strong>Datum:</strong> ${new Date(
          startDateTime,
        ).toLocaleDateString("en-GB")}</li>
        <li><strong>Starttijd:</strong> ${new Date(
          startDateTime,
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}</li>
        
      </ul>
      <p>Gelieve deze reservatie te respecteren!</p> <br/>
  <p style="font-size: 0.9em; color: #666;">Ijskarren · Feesten · Bedrijfsevents · En meer!</p>
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

module.exports = { addToGoogleCalendar };
