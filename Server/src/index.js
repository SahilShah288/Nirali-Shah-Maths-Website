require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

/**
 * Log missing env vars once per cold start (visible in Vercel function logs).
 */
function logMissingEnv() {
  if (!process.env.MONGO_URI) {
    console.error(
      "[CONFIG] MONGO_URI is missing. Set it in Vercel Project Settings → Environment Variables."
    );
  }
  if (!process.env.GOOGLE_SCRIPT_URL) {
    console.error(
      "[CONFIG] GOOGLE_SCRIPT_URL is missing. Enquiry sync to Google Sheets will fail."
    );
  }
}

logMissingEnv();

function isHealthCheck(req) {
  const path = (req.url || "").split("?")[0];
  return path === "/health" || path === "/health/";
}

/**
 * Vercel serverless entry — no app.listen(); all traffic is routed here via vercel.json rewrites.
 */
module.exports = async (req, res) => {
  try {
    if (!isHealthCheck(req)) {
      await connectDatabase();
    }
  } catch (err) {
    console.error("[DB] Connection failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  }

  return app(req, res);
};
