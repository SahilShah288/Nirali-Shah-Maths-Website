require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Nirali Shah Maths Tuitions API running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
