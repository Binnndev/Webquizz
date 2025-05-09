const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const AuthController = {
  registerUser: async (req, res, next) => {
    const registrationSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    try {
      const { error } = registrationSchema.validate(req.body);
      if (error)
        return res.status(400).send("[validation error] Invalid data given.");

      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) return res.status(400).send("User already exists");

      const { name, email, password } = req.body;

      const salt = bcrypt.genSaltSync();
      const hashedPass = bcrypt.hashSync(password, salt);

      const user = new User({
        name: name,
        email: email,
        password: hashedPass,
      });
      const savedUser = await user.save();

      return savedUser;
    } catch (err) {
      return res.status(400).send("Invalid data given.");
    }
  },
  loginUser: async (req, res, next) => {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    try {
      const { error } = loginSchema.validate(req.body);
      if (error)
        return res.status(400).send("[validation error] Invalid Credentials.");

      const user = (await User.findOne({ email: req.body.email })).toObject();
      if (!user) return res.status(400).send("User do not exist!");

      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) return res.status(400).send("Invalid Credentials!");

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      const { _id, name, email } = user;
      return res
        .header("auth-token", token)
        .status(200)
        .send({ _id, name, email });
    } catch (err) {
      return res.status(400).send("Invalid data given.");
    }
  },

  verifyToken: (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access Denied");
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      return res.status(400).send("Invalid Token");
    }
  },
};

module.exports = AuthController;
