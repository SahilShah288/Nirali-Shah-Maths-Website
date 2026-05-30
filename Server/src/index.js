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

  if (!process.env.ADMIN_API_KEY) {
    console.error(
      "[CONFIG] ADMIN_API_KEY is missing. Admin routes will return 503 until it is set."
    );
  } else {
    console.log(
      `[CONFIG] ADMIN_API_KEY is configured (length: ${process.env.ADMIN_API_KEY.length})`
    );
  }
}

logMissingEnv();

/**
 * Vercel serverless entry — no app.listen(); all traffic via vercel.json rewrite.
 */
module.exports = async (req, res) => {
  try {
    await connectDatabase();
  } catch (err) {
    console.error("[DB] Connection failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  }

  return new Promise((resolve, reject) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    res.on("error", reject);

    app(req, res, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
};
