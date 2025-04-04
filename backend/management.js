 
const express = require("express");
const sql = require("mssql");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_NAME,
  options: { encrypt: true, trustServerCertificate: true },
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Google Calendar API Setup
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendar = google.calendar("v3");
const serviceAccountKey = require("./pierino-test-1521dc6dcc0b.json");
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: SCOPES,
});

// Fetch pending bookings
router.get("/bookings", async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query("SELECT * FROM Bookings WHERE Status = 'pending'");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve or Decline booking
router.post("/update-booking", async (req, res) => {
  const { id, status } = req.body;
  if (!["approved", "declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    let pool = await sql.connect(dbConfig);
    let booking = await pool.request().input("Id", sql.Int, id).query("SELECT * FROM Bookings WHERE Id = @Id");
    if (booking.recordset.length === 0) return res.status(404).json({ error: "Booking not found" });

    await pool.request().input("Id", sql.Int, id).input("Status", sql.VarChar, status).query("UPDATE Bookings SET Status = @Status WHERE Id = @Id");

    const { Email, Name, Location, StartDateTime, EndDateTime } = booking.recordset[0];
    let subject, text;
    
    if (status === "approved") {
      subject = "Booking Approved!";
      text = `Hello ${Name}, your booking at ${Location} has been approved!`;
      await addToGoogleCalendar(Name, Location, StartDateTime, EndDateTime);
    } else {
      subject = "Booking Declined";
      text = `Hello ${Name}, unfortunately, your booking at ${Location} has been declined.`;
    }

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

// Add event to Google Calendar
const addToGoogleCalendar = async (name, location, startDateTime, endDateTime) => {
  try {
    const authClient = await auth.getClient();
    const event = {
      summary: `Ice Cream Truck Booking for ${name}`,
      location,
      start: { dateTime: startDateTime, timeZone: "Europe/Brussels" },
      end: { dateTime: endDateTime, timeZone: "Europe/Brussels" },
    };
    await calendar.events.insert({
      auth: authClient,
      calendarId: "primary",
      resource: event,
    });
  } catch (error) {
    console.error("Google Calendar Error:", error);
  }
};

module.exports = router;
