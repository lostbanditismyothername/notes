const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");

// Custom morgan token
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

// Connect to MongoDB
logger.info(`Connecting to ${config.MONGODB_URI}`);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => logger.error(error.message));

// Middlewares
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
