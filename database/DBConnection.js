const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

function connect() {
  mongoose.connect(
    process.env.DB_URI,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log("Connected to Database.")
  );
}

const DBConnection = {
  dbConnect: () => {
    mongoose
      .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('DB error:', err));
  }
};

module.exports = DBConnection;
