const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  sender_email: process.env.GMAIL,
  admin_email: process.env.ADMIN_GMAIL,
  sender_password: process.env.PASSWORD,
  mail_host: process.env.MAIL_HOST,
  mail_port: process.env.MAIL_PORT,
};
