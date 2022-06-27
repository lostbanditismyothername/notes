const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { PORT } = process.env;

const MONGODB_URI =
  process.env.NODE_ENV === "test" ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGODB_URI,
};
