const { send, sendQRPNG, sendQRBase64, sendQRAttach } = require("../../mail");
const Peserta = require("../../models/Peserta");
const { generateQRPNG } = require("../../utils/generateQRPNG");
// const { QueryTypes } = require("sequelize");

const {
  responseSukses,
  responseReject,
  responseException,
} = require("../../utils/handlerResponse");
var QRCode = require("qrcode");
const sequelize = require("../../configs/db");

const register = async (req, res) => {
  try {
    // password != password_confirmation && new Error("password tidak sama");

    let dataPeserta = {
      no_peserta: "",
      event,
      nama,
      no_whatsapp,
      ukuran,
      email,
      password,
      password_confirmation,
      nip,
      umur,
      departement,
      alamat,
      flag_internal,
      qr_code: "",
    };

    const peserta = await Peserta.create(dataPeserta);

    let result = {
      peserta,
    };

    res.status(200).json(responseSukses(result));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

module.exports = { register };
