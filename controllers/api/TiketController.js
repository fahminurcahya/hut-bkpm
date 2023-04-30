const Peserta = require("../../models/Peserta");
const Tiket = require("../../models/Tiket");
const {
  responseReject,
  responseSukses,
  responseException,
} = require("../../utils/handlerResponse");

const getData = async (req, res) => {
  const { qr_code } = req.params;
  try {
    const tiket = await Tiket.findOne({
      where: { qr_code },
    });

    if (!tiket) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    const peserta = await Peserta.findOne({
      where: { id: tiket.id_peserta },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!peserta) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    let result = {
      peserta: peserta,
      tiket: tiket,
    };
    res.status(200).json(responseSukses(result));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const claimRacePack = async (req, res) => {
  const { qr_code } = req.params;

  try {
    const tiket = await Tiket.findOne({
      where: { qr_code },
    });

    if (!tiket) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    await Tiket.update(
      { flag_racepack: true, racepack_updated: new Date() },
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
    const tiket = await Tiket.findOne({
      where: { qr_code },
    });

    if (!tiket) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    await Tiket.update(
      { flag_checkin: true, checkin_updated: new Date() },
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
module.exports = {
  getData,
  claimRacePack,
  checkin,
};
