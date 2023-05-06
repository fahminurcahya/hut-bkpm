const {
  send,
  sendQRPNG,
  sendQRBase64,
  sendQRAttach,
  generatePDF,
} = require("../../mail");
const Peserta = require("../../models/Peserta");
const { generateQRPNG } = require("../../utils/generateQRPNG");
// const { QueryTypes } = require("sequelize");

const {
  responseSukses,
  responseReject,
  responseException,
} = require("../../utils/handlerResponse");

const { sendQRAttachWithGeneratePdf, sendNotifAdmin } = require("../../mail");
var QRCode = require("qrcode");
const sequelize = require("../../configs/db");
const Pendamping = require("../../models/Pendamping");

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
    golongan_darah,
    flag_racepack,
    flag_checkin,
    nama_darurat,
    hubungan,
    alamat_darurat,
    no_hp_darurat,
    nik,
    pendamping,
  } = req.body;
  console.log(pendamping);
  const t = await sequelize.transaction();

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
      golongan_darah,
      flag_racepack,
      nik,
      flag_checkin,
      nama_darurat,
      hubungan,
      no_hp_darurat,
      alamat_darurat,
    };

    const peserta = await Peserta.create(dataPeserta, { transaction: t });

    // if (event === "fw" && flag_internal) {
    //   // let dataPendamping = {};
    //   let dataPendamping = {};
    //   console.log(pendamping.length);
    //   for (let i = 0; i < pendamping.length; i++) {
    //     dataPendamping.id_peserta = peserta.id;
    //     dataPendamping.id_pendamping = i + 1;
    //     dataPendamping.nama = pendamping[i].nama_pendamping;
    //     dataPendamping.ukuran = pendamping[i].ukuran;
    //     console.log(dataPendamping);
    //     const pendampings = await Pendamping.create(dataPendamping, {
    //       transaction: t,
    //     });
    //   }
    //   console.log(dataPendamping);
    // }

    if (event === "fw" && flag_internal) {
      const {
        nama_pendamping_1,
        nama_pendamping_2,
        nama_pendamping_3,
        nama_pendamping_4,
        nama_pendamping_5,
        ukuran_1,
        ukuran_2,
        ukuran_3,
        ukuran_4,
        ukuran_5,
      } = req.body;

      let dataPendamping = {};
      let namap = "nama_pendamping_";
      for (let i = 1; i <= 5; i++) {
        if (
          this["nama_pendamping_" + i] != undefined ||
          this["nama_pendamping_" + i] != null ||
          this["nama_pendamping_" + i] != ""
        ) {
          dataPendamping.id_peserta = peserta.id;
          dataPendamping.id_pendamping = i;
          dataPendamping.nama = `${namap}` + `${i}`;
          dataPendamping.ukuran = this["ukuran_" + i];
          console.log(dataPendamping);
          const pendamping = await Pendamping.create(dataPendamping);
        }
      }
    }
    // throw new Error("daad");

    await generateQRPNG(peserta.no_peserta, peserta.qr_code, peserta.event);
    await generatePDF(email, peserta.no_peserta, peserta.nama, peserta.event);

    await t.commit();

    let result = {
      peserta,
    };

    // --- send qr dengan base 64 ---
    // const qr = await QRCode.toDataURL(peserta.qr_code);
    // peserta.qr = qr;
    // await sendQRBase64(email, peserta);

    // await generateQRPNG(peserta.no_peserta, peserta.qr_code);
    // // await generatePDF(peserta.no_peserta, event);

    // // await sendQRPNG(email, peserta);
    // // await sendQRAttach(email, peserta);
    // await sendQRAttachWithGeneratePdf(email, peserta.no_peserta, event);
    // await sendNotifAdmin(email, peserta.no_peserta, peserta.nama, event);

    res.status(200).json(responseSukses(result));
  } catch (err) {
    await t.rollback();

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
