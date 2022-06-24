const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:", req.path);
  logger.info("Body:", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ Error: "Unknown Endpoint" });
};

const errorHandler = (req, res) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ Error: "Malformatted ID" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ Error: Error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
