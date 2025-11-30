const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: String,
    gender: String,
    phone: String,
    email: String,
    medicalCondition: String,

    // Must remain strings to avoid timezone conversion
    appointmentDate: String,
    appointmentTime: String,

    tokenNumber: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
