var QRCode = require("qrcode");

const generateQRPNG = async (no_peserta, qr_code, event) => {
  let path = "";
  event === "fw"
    ? (path = "images/fw/" + no_peserta + ".png")
    : (path = "images/fr/" + no_peserta + ".png");

  const filePath = "./public/" + path;
  console.log(filePath);
  try {
    const qrCode = await QRCode.toFile(filePath, qr_code, {
      type: "png",
      margin: 1,
      width: 500, // Lebar gambar QR yang diinginkan
      color: {
        dark: "#000", // warna QR code
        light: "#fff", // warna background QR code
      },
    });
    console.log("QR code berhasil dibuat pada file " + filePath);
    return qrCode;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { generateQRPNG };
