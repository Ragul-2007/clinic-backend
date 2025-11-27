const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    gender: String,
    phone: String,
    email: String,

    medicalCondition: String,

    appointmentDate: Date,
    appointmentTime: String,

    tokenNumber: Number,
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
