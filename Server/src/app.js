const express = require("express");
const cors = require("cors");
const { isDatabaseConnected } = require("./config/database");
const enquiryRoutes = require("./routes/enquiryRoutes");
const slotRoutes = require("./routes/slotRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

/**
 * Vercel may forward req.url with the handler path; restore the client path for Express.
 */
app.use((req, res, next) => {
  const url = req.url || "/";
  const handlerPrefixes = ["/src/index.js"];

  for (const prefix of handlerPrefixes) {
    if (url === prefix || url.startsWith(`${prefix}/`)) {
      const rest = url.slice(prefix.length) || "/";
      req.url = rest.includes("?")
        ? rest
        : rest.startsWith("/")
          ? rest
          : `/${rest}`;
      break;
    }
  }

  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nirali Shah Maths Tuitions API is running",
    docs: {
      health: "/health",
      enquiry: "/api/enquiry",
      slots: "/api/slots",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Nirali Shah Maths Tuitions API",
    environment: process.env.NODE_ENV || "development",
    mongo: isDatabaseConnected() ? "connected" : "disconnected",
    adminKeyConfigured: Boolean(process.env.ADMIN_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/enquiry", enquiryRoutes);
app.use("/api/slots", slotRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.url,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;
