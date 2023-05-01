const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  email: process.env.GMAIL,
  password: process.env.PASSWORD,
  sender_email: process.env.GMAIL,
  sender_password: process.env.PASSWORD,
};
