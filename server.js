// server.js (BACKEND) - FINAL VERSION

require("dotenv").config();
console.log("ENV MONGO_URI =", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Appointment = require("./models/Appointment");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// =======================
// CONNECT TO MONGODB
// =======================
mongoose.connect(process.env.MONGO_URI, {
    dbName: "clinicdb"
})
.then(() => {
    console.log("MongoDB Connected");
    console.log("Connected to DB: clinicdb");
})
.catch((err) => console.log("MongoDB Error:", err));

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.send("Clinic backend running");
});

// =======================
// CREATE APPOINTMENT
// =======================
app.post("/api/appointments", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      medicalCondition,
      appointmentDate, // "YYYY-MM-DD"
      appointmentTime, // "HH:MM"
    } = req.body;

    if (!name || !phone || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // DAY-WISE TOKEN NUMBER (based on the selected appointmentDate)
    const dateKey = appointmentDate; // e.g. "2025-11-30"
    const countForDay = await Appointment.countDocuments({
      appointmentDate: dateKey,
    });

    const tokenNumber = String(countForDay + 1).padStart(3, "0"); // 001, 002, ...

    const newAppointment = await Appointment.create({
      name,
      email,
      phone,
      gender,
      medicalCondition,
      appointmentDate, // stored exactly as sent
      appointmentTime, // stored exactly as sent
      tokenNumber,
    });

    return res.json({
      success: true,
      data: newAppointment,
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating appointment",
    });
  }
});

// =======================
// GET ALL APPOINTMENTS
// =======================
app.get("/api/appointments", async (req, res) => {
  try {
    const list = await Appointment.find().sort({
      appointmentDate: 1,
      appointmentTime: 1,
      createdAt: 1,
    });

    return res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING → http://localhost:${PORT}`);
});
