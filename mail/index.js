const nodemailer = require("nodemailer");
const Mustache = require("mustache");
const {
  mail_port,
  sender_password,
  sender_email,
  mail_host,
} = require("../configs/email");
const fs = require("fs");
const pdf = require("html-pdf");

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

const sendQRAttachWithGeneratePdf = async (email, no_peserta, event) => {
  try {
    let template;
    if (event == "FUN RUN 7K") {
      template = fs.readFileSync("views/pdf/tiket_fr.html", "utf8");
    } else {
      template = fs.readFileSync("views/pdf/tiket_js.html", "utf8");
    }
    const data = {
      no_peserta: no_peserta,
      public_url: process.env.PUBLIC_URL,
    };
    const html = Mustache.render(template, data);

    const options = {
      format: "A4",
      scale: 0.1,
      margin: {
        top: "20000mm",
        bottom: "20mm",
        left: "20mm",
        right: "20mm",
      },
      orientation: "landscape",
    };
    const path = "pdf/" + no_peserta + ".pdf";
    const filePath = "./public/" + path;
    pdf.create(html, options).toFile(filePath, async function (err, res) {
      if (err) throw new Error(err);
      let templateEmail = fs.readFileSync("views/email/tiket_3.html", "utf8");
      const attachment1 = await fs.readFileSync(
        "public/images/" + no_peserta + ".png"
      );

      const attachment2 = await fs.readFileSync(
        "public/pdf/" + no_peserta + ".pdf"
      );

      const public_url = process.env.PUBLIC_URL;

      let message = {
        from: sender_email,
        to: email,
        subject: "HUT BKPM 50",
        html: Mustache.render(templateEmail, { public_url: public_url, nama: data.nama, no_peserta: data.no_peserta }),
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
      console.log("PDF code berhasil dibuat pada file " + filePath); // { filename: '/app/businesscard.pdf' }
      return await transporter.sendMail(message);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  sendQRBase64,
  sendQRPNG,
  sendQRAttach,
  sendQRAttachWithGeneratePdf,
};
