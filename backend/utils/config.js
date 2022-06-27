const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { PORT } = process.env;
const { MONGODB_URI } = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
};
