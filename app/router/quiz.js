const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");
const QuizzerController = require("../controller/QuizzerController");
const QuizController = require("../controller/QuizController");

router.get("/user/:userId", AuthController.verifyToken, async (req, res) => {
  try {
    const list = await Quiz.find({ user_id: req.params.userId });
    res.json(list);
  } catch (err) {
    res.status(500).send("Server error");
  }
});
router.get("/", AuthController.verifyToken, async (req, res, next) => {
  console.log("Get Quizzer Data");
  await QuizController.findAll(req, res, next);
});

router.get("/:quiz_id", AuthController.verifyToken, async (req, res, next) => {
  await QuizController.findById(req, res, next);
});

router.get(
  "/quizzer/:user_id",
  AuthController.verifyToken,
  async (req, res, next) => {
    await QuizController.findByUser(req, res, next);
  }
);

router.post(
  "/submit/:user_id",
  AuthController.verifyToken,
  async (req, res, next) => {
    await QuizController.submitQuizAnswer(req, res, next);
  }
);

module.exports = router;
