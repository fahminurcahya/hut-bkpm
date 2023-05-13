const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../configs/db");
const bcrypt = require("bcryptjs");
const Pendamping = require("./Pendamping");

const Peserta = sequelize.define(
  "peserta",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    no_peserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_whatsapp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ukuran: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    event: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    departement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    jenkel: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    golongan_darah: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag_internal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    qr_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag_racepack: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    flag_checkin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    nama_darurat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hubungan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat_darurat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_hp_darurat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flag_email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    hooks: {
      afterCreate: (peserta, options) => {
        // hide password in response
        peserta.password = undefined;
      },
    },
  }
);

// Peserta.hasOne(Tiket, { as: "tiket", foreignKey: "id_peserta" });

Peserta.beforeCreate(async (peserta, options) => {
  // validasi email
  const existingEmail = await Peserta.findOne({
    where: { email: peserta.email },
  });
  if (existingEmail) {
    throw new UserException("Email sudah terdaftar.");
  }

  // validasi no_whatsapp
  const existingWa = await Peserta.findOne({
    where: { no_whatsapp: peserta.no_whatsapp },
  });
  if (existingWa) {
    throw new UserException("No WA sudah terdaftar.");
  }

  //validate kuota
  if (peserta.event == "fr") {
    const countFR = await Peserta.count({
      where: { event: "fr" },
    });
    if (countFR >= 1500) {
      throw new UserException("Mohon maaf kuota Fun Run penuh.");
    }
  }

  if (peserta.flag_internal == "1") {
    const countInternal = await Peserta.count({
      where: { flag_internal: true },
    });

    const countPendamping = await Pendamping.count();
    const pesertaInternal = countPendamping + countInternal;

    if (pesertaInternal >= 750) {
      throw new UserException("Mohon maaf kuota Internal Kementerian Investasi/BKPM penuh.");
    }

  } else {
    const countExternal = await Peserta.count({
      where: { flag_internal: false },
    });
    if (countExternal >= 1250) {
      throw new UserException("Mohon maaf kuota Ekternal penuh.");
    }
  }

  // generate seq no peserta
  const lastPeserta = await Peserta.findOne({
    order: [["no_peserta", "DESC"]],
    where: {
      event: peserta.event,
    },
    attributes: ["no_peserta"],
  });

  if (lastPeserta) {
    peserta.no_peserta = lastPeserta.no_peserta + 1;
  } else {
    if (peserta.event == "fw") {
      peserta.no_peserta = 30001;
    } else {
      peserta.no_peserta = 10001;
    }
  }

  peserta.password = await bcrypt.hash(peserta.password, 12);

  //generate qr code
  const keyLength = 10;
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let qrCode = "";
  for (let i = 0; i < keyLength; i++) {
    qrCode += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  peserta.qr_code = qrCode;
});

function UserException(message) {
  this.message = message;
  this.name = "validation";
}

module.exports = Peserta;
