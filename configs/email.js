const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  email: process.env.GMAIL,
  password: process.env.PASSWORD,
};
