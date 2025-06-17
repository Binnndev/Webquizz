const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
const User     = require("../model/user");
const Quizzer  = require("../model/quizzer");
const Quiz     = require("../model/quiz");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
  });

  // xóa sạch data cũ
  await User.deleteMany({});
  await Quizzer.deleteMany({});
  await Quiz.deleteMany({});

  // tạo admin với mật khẩu admin123
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("admin123", salt);
  const u = await User.create({
    name:     "Admin",
    email:    "admin@qz.com",
    password: hash
  });

  // tạo profile quizzer
  await Quizzer.create({
    _id:   u._id.toString(),
    name:  u.name,
    email: u.email
  });

  console.log("✅ Seed completed with Admin / admin123");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});