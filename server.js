const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Appointment = require("./models/Appointment");

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// CONNECT TO MONGODB ATLAS
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));


// =============================
// CREATE APPOINTMENT
// =============================
app.post("/api/appointments", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      appointmentDate,
      appointmentTime,
      medicalCondition,
      notes,
    } = req.body;

    if (!name || !phone || !appointmentDate || !appointmentTime) {
      return res.json({ success: false, message: "Missing fields" });
    }

    // Combine date + time properly (IST)
    const dateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    dateTime.setHours(dateTime.getHours() + 5);
    dateTime.setMinutes(dateTime.getMinutes() + 30);

    const start = new Date(dateTime);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateTime);
    end.setHours(23, 59, 59, 999);

    const count = await Appointment.countDocuments({
      appointmentDate: { $gte: start, $lte: end },
    });

    const tokenNumber = count + 1;

    const newApp = await Appointment.create({
      name,
      age,
      gender,
      phone,
      email,
      appointmentDate: dateTime,
      appointmentTime,
      medicalCondition,
      tokenNumber,
      notes,
    });

    res.json({ success: true, data: newApp });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});


// =============================
// GET ALL APPOINTMENTS
// =============================
app.get("/api/appointments", async (req, res) => {
  try {
    const list = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.json({ success: false });
  }
});


// =============================
// START SERVER ON RENDER
// =============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Backend running on port", PORT));

