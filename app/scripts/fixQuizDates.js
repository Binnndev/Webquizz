require("dotenv").config();
const mongoose = require("mongoose");
const Quiz = require("../model/quiz");

async function run() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✓ Connected to MongoDB");

  const now = new Date();
  const result = await Quiz.updateMany(
    {}, 
    { $set: { date: now } }
  );

  // Lấy matched & modified tùy vào bản Mongoose
  const matched =
    result.matchedCount !== undefined
      ? result.matchedCount
      : result.n; // fallback Mongoose 5
  const modified =
    result.modifiedCount !== undefined
      ? result.modifiedCount
      : result.nModified; // fallback Mongoose 5

  console.log(`Matched ${matched} docs, modified ${modified} docs.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});