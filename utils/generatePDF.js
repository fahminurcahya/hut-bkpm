var fs = require("fs");
var pdf = require("html-pdf");
const Mustache = require("mustache");

const generatePDF = async (no_peserta, event) => {
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
  pdf.create(html, options).toFile(filePath, function (err, res) {
    if (err) throw new Error(err);
    console.log("PDF code berhasil dibuat pada file " + filePath); // { filename: '/app/businesscard.pdf' }
  });
};

module.exports = { generatePDF };
