const { generatePDF } = require("../../mail");
const Pendamping = require("../../models/Pendamping");
const Peserta = require("../../models/Peserta");
const { generateQRPNG } = require("../../utils/generateQRPNG");
const {
  responseReject,
  responseSukses,
  responseException,
} = require("../../utils/handlerResponse");

const getData = async (req, res) => {
  const { qr_code } = req.params;
  try {
    const peserta = await Peserta.findOne({
      where: { qr_code },
    });

    if (!peserta) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    let result = {
      peserta: peserta,
    };

    res.status(200).json(responseSukses(result));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const sendMail = async (req, res) => {
  const { email } = req.params;
  try {
    const peserta = await Peserta.findOne({
      where: { email },
    });

    if (!peserta) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    await generateQRPNG(peserta.no_peserta, peserta.qr_code, peserta.event);
    await generatePDF(email, peserta.no_peserta, peserta.nama, peserta.event);
    res.status(200).json(responseSukses());
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const claimRacePack = async (req, res) => {
  const { qr_code } = req.params;

  try {
    await Peserta.update(
      { flag_racepack: true },
      {
        where: {
          qr_code,
        },
      }
    );

    res.status(200).json(responseSukses());
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const checkin = async (req, res) => {
  const { qr_code } = req.params;

  try {
    await Peserta.update(
      { flag_checkin: true },
      {
        where: {
          qr_code,
        },
      }
    );

    res.status(200).json(responseSukses());
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const scan = async (req, res) => {
  const { qr_code } = req.params;

  try {
    const peserta = await Peserta.findOne({
      where: { qr_code },
    });

    if (!peserta) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }
    const pendamping = await Pendamping.findAll({
      where: { id_peserta: peserta.id },
    });
    let data = {
      peserta,
      pendamping,
    };
    res.status(200).json(responseSukses(data));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};
module.exports = {
  getData,
  claimRacePack,
  checkin,
  sendMail,
  scan,
};
