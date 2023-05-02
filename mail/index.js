const nodemailer = require("nodemailer");
const Mustache = require("mustache");
const {
  mail_port,
  sender_password,
  sender_email,
  mail_host,
} = require("../configs/email");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: mail_host,
  port: mail_port,
  tls: {
    rejectUnauthorized: false,
  },
  // secure: true, // true for 465, false for other ports
  auth: {
    user: sender_email,
    pass: sender_password,
  },
});

const sendQRBase64 = async (email, data) => {
  try {
    let template = fs.readFileSync("views/email/tiket.html", "utf8");
    let message = {
      from: sender_email,
      to: email,
      subject: "Otp for registration is: ",
      html: Mustache.render(template, data),
    };
    return await transporter.sendMail(message);
  } catch (ex) {
    console.log(err);
    throw err;
  }
};

const sendQRPNG = async (email, data) => {
  try {
    let template = fs.readFileSync("views/email/tiket_2.html", "utf8");
    const attachment = await fs.readFileSync(
      "public/images/" + data.no_peserta + ".png"
    );
    data.qr = process.env.PUBLIC_URL + "/images/" + data.no_peserta + ".png";
    console.log(data.qr);

    let message = {
      from: email,
      to: email,
      subject: "HUT BKPM 50",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const sendQRAttach = async (email, data) => {
  try {
    let template = fs.readFileSync("views/email/tiket_3.html", "utf8");
    const attachment1 = await fs.readFileSync(
      "public/images/" + data.no_peserta + ".png"
    );

    const attachment2 = await fs.readFileSync(
      "public/pdf/" + data.no_peserta + ".pdf"
    );

    const public_url = process.env.PUBLIC_URL;

    let message = {
      from: sender_email,
      to: email,
      subject: "HUT BKPM 50",
      html: Mustache.render(template, { public_url: public_url }),
      attachments: [
        {
          filename: "QR.png",
          content: attachment1,
        },
        {
          filename: "tiket.pdf",
          content: attachment2,
        },
      ],
    };

    return await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = { sendQRBase64, sendQRPNG, sendQRAttach };
