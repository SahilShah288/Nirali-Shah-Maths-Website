const mongoose = require("mongoose");

const BOARDS = ["CBSE", "ICSE", "IB", "IGCSE", "State"];
const COMPETITIVE_EXAMS = ["Olympiads", "NTSE"];

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: (v) => /^\+[0-9]{10,16}$/.test(String(v).replace(/\s/g, "")),
        message: "Phone must be a valid international number with country code",
      },
    },
    countryCode: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    class: {
      type: Number,
      required: [true, "Class is required"],
      min: [4, "Class must be between 4 and 12"],
      max: [12, "Class must be between 4 and 12"],
    },
    board: {
      type: String,
      required: [true, "Board is required"],
      enum: {
        values: BOARDS,
        message: `Board must be one of: ${BOARDS.join(", ")}`,
      },
    },
    competitiveExams: {
      type: [String],
      enum: {
        values: COMPETITIVE_EXAMS,
        message: `Each exam must be one of: ${COMPETITIVE_EXAMS.join(", ")}`,
      },
      default: [],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
module.exports.BOARDS = BOARDS;
module.exports.COMPETITIVE_EXAMS = COMPETITIVE_EXAMS;
