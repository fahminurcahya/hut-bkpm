const Peserta = require("../../models/Peserta");
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

const claimRacePack = async (req, res) => {
  const { qr_code } = req.params;

  try {
    const peserta = await Peserta.findOne({
      where: { qr_code },
    });

    if (!peserta) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    if (peserta.flag_racepack) {
      return res
        .status(200)
        .json(responseReject("Peserta telah mengambil starterkit", peserta));
    }

    await Peserta.update(
      { flag_racepack: true },
      {
        where: {
          qr_code,
        },
      }
    );

    res.status(200).json(responseSukses(peserta));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

const checkin = async (req, res) => {
  const { qr_code } = req.params;

  try {
    const peserta = await Peserta.findOne({
      where: { qr_code },
    });

    if (!peserta) {
      return res.status(200).json(responseReject("Data tidak ditemukan"));
    }

    if (peserta.flag_checkin) {
      return res
        .status(200)
        .json(responseReject("Peserta telah checkin sebelumnya", peserta));
    }

    await Peserta.update(
      { flag_checkin: true },
      {
        where: {
          qr_code,
        },
      }
    );

    res.status(200).json(responseSukses(peserta));
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
