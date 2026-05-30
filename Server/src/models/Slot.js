const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
      match: [/^\d{2}:\d{2}$/, 'Time must be in "HH:mm" format (e.g. "16:00")'],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    studentName: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

slotSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);
