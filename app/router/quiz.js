const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");
const QuizzerController = require("../controller/QuizzerController");
const QuizController = require("../controller/QuizController");
const Quiz = require("../model/quiz");


// Tạo quiz mới
router.post("/", AuthController.verifyToken, async (req, res) => {
  console.log("Create Quiz payload:", JSON.stringify(req.body, null, 2));

  // Schema validation với Joi (nếu muốn chính xác hơn)
  const Joi = require("@hapi/joi");
  const quizSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    type: Joi.string().required(),
    questions: Joi.array()
      .min(1)
      .items(
        Joi.object({
          id: Joi.number().required(),
          title: Joi.string().required(),
          options: Joi.array()
            .min(2)
            .items(
              Joi.object({
                id: Joi.number().required(),
                value: Joi.string().required(),
              })
            )
            .required(),
          answer: Joi.number().required(),
        })
      )
      .required(),
  });

  const { error: valErr } = quizSchema.validate(req.body);
  if (valErr) {
    console.warn("Quiz payload validation failed:", valErr.message);
    return res.status(400).json({ error: valErr.message });
  }

  try {
    const { title, description, type, questions } = req.body;
    const userId = req.user._id;
    const quiz = new Quiz({ user_id: userId, title, description, type, questions });
    const saved = await quiz.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Create Quiz error:", err);
    // nếu là lỗi Mongoose validation
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:userId", AuthController.verifyToken, async (req, res) => {
  try {
    const list = await Quiz.find({ user_id: req.params.userId });
    return res.json(list);
  } catch (err) {
    console.error("Get Quizzes error:", err);
    return res.status(500).send("Server error");
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
