/**
 * Local development server (uses app.listen).
 * Production/Vercel uses src/index.js serverless export only.
 */
require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("[CONFIG] MONGO_URI is missing from .env");
}
if (!process.env.GOOGLE_SCRIPT_URL) {
  console.error("[CONFIG] GOOGLE_SCRIPT_URL is missing from .env");
}

async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Nirali Shah Maths Tuitions API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
