const express = require("express");
const router = express.Router();

// import
const DBConnection = require("../../database/DBConnection");
const auth = require("./auth");
const quizzer = require("./quizzer");
const quiz = require("./quiz");

router.get("/", (req, res) => {
  res.send("Hello to QuizDen Backend System");
});

// connect to database
DBConnection.dbConnect();

// route middleware
router.use("/auth",    auth);     
router.use("/quizzers", quizzer);
router.use("/quizzes",  quiz);


module.exports = router;
