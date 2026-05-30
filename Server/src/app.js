const express = require("express");
const cors = require("cors");
const { isDatabaseConnected } = require("./config/database");
const enquiryRoutes = require("./routes/enquiryRoutes");
const slotRoutes = require("./routes/slotRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Nirali Shah Maths Tuitions API",
    environment: process.env.NODE_ENV || "development",
    mongo: isDatabaseConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/enquiry", enquiryRoutes);
app.use("/api/slots", slotRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;
