const Joi = require("@hapi/joi");

const Quiz = require("../model/quiz");
const QuizzerController = require("./QuizzerController");
const Quizzer = require("../model/quizzer");

const QuizController = {
  createQuiz: async (req, res, next) => {
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
      console.warn("❌ Quiz validation failed:", valErr.message);
      return res.status(400).json({ error: valErr.message });
    }

    try {
      const { title, description, type, questions } = req.body;
      const user_id = req.user._id;

      // kiểm tra tiêu đề đã tồn tại cho user hiện tại chưa
      const existing = await Quiz.findOne({ user_id, title });
      if (existing) {
        return res.status(400).json({ error: "Quiz title already exists." });
      }

      // kiểm tra giới hạn số quiz (vd: tối đa 10 quiz mỗi người)
      const totalCreated = await Quiz.countDocuments({ user_id });
      if (totalCreated >= 10) {
        return res.status(400).json({ error: "You have reached the limit of 10 quizzes." });
      }

      const quiz = new Quiz({ user_id, title, description, type, questions });
      const savedQuiz = await quiz.save();

      const updatedQuizzer = await Quizzer.findByIdAndUpdate(user_id, { $inc: { quizCurated: 1 } });
      if (!updatedQuizzer) {
        return res.status(400).json({ error: "Quizzer does not exist." });
      }

      return res.status(201).json(savedQuiz);
    } catch (err) {
      console.error("❌ Create Quiz error:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: "Server error" });
    }
  },

  findById: async (req, res, next) => {
    try {
      const quiz = await Quiz.findById(req.params.quiz_id);
      if (quiz) {
        // remove answers and send
        const { questions } = quiz;
        for (let i = 0; i < questions.length; i++) {
          const { _id, options, id, title } = questions[i];
          questions[i] = { _id, options, id, title };
        }
        quiz.questions = questions;
        return res.status(200).send(quiz);
      }
      return res.status(400).send("Quiz not found.");
    } catch (err) {
      console.log("Error", err);
      return res.status(400).send("Invalid data given.");
    }
  },

  findAll: async (req, res, next) => {
    try {
      const quizzes = await Quiz.find();
      if (quizzes) {
        return res.status(200).send(quizzes);
      }
      return res.status(400).send("Invalid data given.");
    } catch (err) {
      console.log("Error", err);
      return res.status(400).send("Invalid data given.");
    }
  },

  findByUser: async (req, res, next) => {
    try {
      const quizzes = await Quiz.find({ user_id: req.params.user_id });
      if (quizzes) {
        return res.status(200).send(quizzes);
      }
      return res.status(400).send("Invalid data given.");
    } catch (err) {
      console.log("Error", err);
      return res.status(400).send("Invalid data given.");
    }
  },

  submitQuizAnswer: async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const { quiz_id, answers } = req.body;

      const quiz = await Quiz.findById(quiz_id);
      if (quiz) {
        let solved = 0;
        const { questions } = quiz;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].answer === answers[i].answer) {
            solved++;
          }
        }

        // update quiz stats
        quiz.participated++;
        quiz.flawless += Number(solved === questions.length); // + 0 or 1
        const updatedQuiz = await Quiz.findByIdAndUpdate(quiz_id, quiz);

        // update quizzer stats
        const updatedQuizzer =
          await QuizzerController.incrementParticipationCount(
            user_id,
            solved === questions.length
          );

        const response = {
          user_id: user_id,
          quiz_id: quiz_id,
          total_questions: questions.length,
          solved: solved,
        };
        res.status(200).send(response);
      } else {
        res.status(400).send("Quiz not found!");
      }
    } catch (err) {
      console.log("Error", err);
      return res.status(400).send("Invalid data given.");
    }
  },
};

module.exports = QuizController;
