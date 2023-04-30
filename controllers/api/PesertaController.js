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
  const {
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
  } = req.body;
  try {
    let dataPeserta = {
      no_peserta: 1001,
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

    // await sendQRPNG(email, peserta);
    await sendQRAttach(email, peserta);

    res.status(200).json(responseSukses(result));
  } catch (err) {
    // console.log(email);
    const peserta = await Peserta.findOne({
      where: { email },
    });

    await Peserta.destroy({
      where: {
        email,
      },
      force: true,
    });

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
  const { flag_racepack, flag_checkin } = req.body;

  try {
    let condition = {
      id,
    };

    if (flag_racepack != undefined) {
      condition.flag_racepack = true;
    } else if (flag_checkin != undefined) {
      condition.flag_checkin = true;
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
