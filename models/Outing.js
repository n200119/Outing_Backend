const mongoose = require("mongoose");

const outingSchema = new mongoose.Schema(
  {
    studentName:
    {
      type:String,
      required: true,
    },
    year:
    {
      type: String,
      enum: ["P1", "P2", "E1","E2","E3","E4"],
      required:true
    },
    date: {
      type: Date,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Assuming you have a Student model
      required: true,
    },
    careTakerId:
    {
        type: mongoose.Schema.Types.ObjectId,
      ref: "CareTaker",
      default: null // Optional, default value when not provided
    },
    reason: {
      type: String,
      required: true,
    },
    inTime: {
      type: String, // You may use Date type if you want to store time as a date
      default: null,
    },
    outTime: {
      type: String, // You may use Date type if you want to store time as a date
      default: null,
    },
    outingStatus: {
      type: String,
      enum: ["pending", "rejected", "accepted"], // Restricting values to specific options
      default: "pending", // Default status
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Outing = mongoose.model("Outing", outingSchema);

module.exports = Outing;
