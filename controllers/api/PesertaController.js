const { send, sendQRPNG, sendQRBase64, sendQRAttach } = require("../../mail");
const Peserta = require("../../models/Peserta");
const { generateQRPNG } = require("../../utils/generateQRPNG");
// const { QueryTypes } = require("sequelize");

const {
  responseSukses,
  responseReject,
  responseException,
} = require("../../utils/handlerResponse");

const {
  sendQRAttachWithGeneratePdf,
  sendNotifAdmin,
} = require("../../mail");
var QRCode = require("qrcode");
const sequelize = require("../../configs/db");

const register = async (req, res) => {
  const {
    event,
    nama,
    no_whatsapp,
    ukuran,
    email,
    password,
    nip,
    umur,
    jenkel,
    departement,
    alamat,
    flag_internal,
  } = req.body;
  try {
    let dataPeserta = {
      no_peserta: 101,
      event,
      nama,
      no_whatsapp,
      ukuran,
      email,
      password,
      nip,
      umur,
      jenkel,
      departement,
      alamat,
      flag_internal,
      qr_code: "",
    };

    const peserta = await Peserta.create(dataPeserta);

    let result = {
      peserta,
    };

    // --- send qr dengan base 64 ---
    // const qr = await QRCode.toDataURL(peserta.qr_code);
    // peserta.qr = qr;
    // await sendQRBase64(email, peserta);

    await generateQRPNG(peserta.no_peserta, peserta.qr_code);
    // await generatePDF(peserta.no_peserta, event);

    // await sendQRPNG(email, peserta);
    // await sendQRAttach(email, peserta);
    await sendQRAttachWithGeneratePdf(email, peserta.no_peserta, event);
    await sendNotifAdmin(email, peserta.no_peserta, peserta.nama, event);

    res.status(200).json(responseSukses(result));
  } catch (err) {
    if (err.name !== "validation") {
      await Peserta.findOne({
        where: { email },
      });

      await Peserta.destroy({
        where: {
          email,
        },
        force: true,
      });
    }

    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const getDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const peserta = await Peserta.findOne({
      where: { id },
    });

    let result = {
      peserta: peserta,
    };
    peserta
      ? res.status(200).json(responseSukses(result))
      : res.status(200).json(responseReject("Data tidak ditemukan"));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const getAll = async (req, res) => {
  const { flag_internal } = req.body;

  try {
    let condition = {};

    if (flag_internal != undefined) {
      condition.flag_internal = flag_internal;
    }

    const peserta = await Peserta.findAll({
      where: condition,
    });
    res.status(200).json(responseSukses(peserta));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

module.exports = { register, getDetail, getAll };
