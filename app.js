require("dotenv/config");
const DBConnection = require("./database/DBConnection");
const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require('./app/router/index');

DBConnection.dbConnect();

const app = express();
app.use(
  cors({ origin: 'http://localhost:3000', exposedHeaders: ['auth-token'] })
);
app.use(express.json());

// Sửa tại đây: mount routes
app.use(process.env.API_URI, routes);

// serving static files from react
app.use(express.static(path.join(__dirname, "client","build")));

// fallback for react routes
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "client","build","index.html"))
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

app.listen(process.env.PORT||5000, () =>
  console.log(`Server chạy trên port ${process.env.PORT||5000}`)
);