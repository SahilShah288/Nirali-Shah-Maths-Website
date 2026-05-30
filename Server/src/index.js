require("dotenv").config();
const app = require("./app");
const { connectDatabase } = require("./config/database");

// 1. Pre-connect to Database (Vercel best practice)
let isConnected = false;
const connect = async () => {
  if (isConnected) return;
  try {
    await connectDatabase();
    isConnected = true;
    console.log("Database connected");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
  }
};

// 2. Wrap the app logic to ensure DB is ready
const handler = async (req, res) => {
  await connect();
  return app(req, res);
};

// 3. For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connect().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// 4. CRITICAL: Export the app for Vercel
module.exports = handler;