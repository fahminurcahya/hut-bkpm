const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../configs/db");
const bcrypt = require("bcryptjs");

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
    umur: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jenkel: {
      type: DataTypes.CHAR,
      allowNull: true,
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

  // generate seq no peserta
  const lastPeserta = await Peserta.findOne({
    order: [["no_peserta", "DESC"]],
    attributes: ["no_peserta"],
  });

  if (lastPeserta) {
    peserta.no_peserta = lastPeserta.no_peserta + 1;
  } else {
    peserta.no_peserta = 101;
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
