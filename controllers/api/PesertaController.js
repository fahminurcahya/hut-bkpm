const { send, sendQRPNG, sendQRBase64, sendQRAttach } = require("../../mail");
const Peserta = require("../../models/Peserta");
const Tiket = require("../../models/Tiket");
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
    nama,
    email,
    no_identitas,
    password,
    password_confirmation,
    alamat,
    no_whatsapp,
    flag_internal,
    add_info,
  } = req.body;
  try {
    let dataPeserta = {
      nama,
      email,
      no_identitas,
      password,
      password_confirmation,
      alamat,
      no_peserta: 1001,
      no_whatsapp,
      flag_internal,
      add_info,
    };

    const peserta = await Peserta.create(dataPeserta);

    let dataTiket = {
      id_peserta: peserta.id,
      qr_code: "",
    };

    const tiket = await Tiket.create(dataTiket);
    let result = {
      peserta,
      tiket,
    };

    // --- send qr dengan base 64 ---
    // const qr = await QRCode.toDataURL(tiket.qr_code);
    // peserta.qr = qr;
    // await sendQRBase64(email, peserta);

    await generateQRPNG(peserta.no_peserta, tiket.qr_code);

    // await sendQRPNG(email, peserta);
    await sendQRAttach(email, peserta);

    res.status(200).json(responseSukses(result));
  } catch (err) {
    // console.log(email);
    const peserta = await Peserta.findOne({
      where: { email },
    });

    if (peserta) {
      await Tiket.destroy({
        where: {
          id_peserta: peserta.id,
        },
        force: true,
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
    const peserta = await sequelize.query(
      `
      SELECT peserta.*, NULL AS password, tikets.qr_code
      FROM peserta
      JOIN tikets ON peserta.id = tikets.id_peserta
      WHERE peserta.id = '${id}'
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    // const peserta = await Peserta.findOne({
    //   where: { id },

    //   attributes: {
    //     exclude: ["password"],
    //   },
    // });

    let result = {
      peserta: peserta[0],
    };
    peserta[0]
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
    let qry = `
    SELECT peserta.*, NULL AS password, tikets.*
    FROM peserta
    JOIN tikets ON peserta.id = tikets.id_peserta
  `;
    if (flag_racepack != undefined) {
      qry = qry + "WHERE tikets.flag_racepack = true";
    } else if (flag_checkin != undefined) {
      qry = qry + "WHERE tikets.flag_checkin = true";
    }
    const peserta = await sequelize.query(qry, {
      type: sequelize.QueryTypes.SELECT,
    });

    const transformedResults = peserta.map((result) => ({
      ...result,
      flag_checkin: Boolean(result.flag_checkin),
      flag_racepack: Boolean(result.flag_racepack),
      flag_internal: Boolean(result.flag_internal),
    }));

    res.status(200).json(responseSukses(transformedResults));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

module.exports = { register, getDetail, getAll };
