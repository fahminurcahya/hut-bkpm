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
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
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
    no_identitas: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    no_whatsapp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    no_peserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    flag_internal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["aktif", "tidak aktif"],
      allowNull: false,
      defaultValue: "aktif",
    },
    add_info: {
      type: DataTypes.TEXT,
      allowNull: true,
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
  const existingEmail = await Peserta.findOne({
    where: { email: peserta.email },
  });
  if (existingEmail) {
    throw new Error("Email sudah terdaftar.");
  }
  const existingIdentitas = await Peserta.findOne({
    where: { no_identitas: peserta.no_identitas },
  });
  if (existingIdentitas) {
    throw new Error("NIK/NIP sudah terdaftar.");
  }

  const existingWa = await Peserta.findOne({
    where: { no_whatsapp: peserta.no_whatsapp },
  });
  if (existingWa) {
    throw new Error("No WA sudah terdaftar.");
  }

  const lastPeserta = await Peserta.findOne({
    order: [["no_peserta", "DESC"]],
    attributes: ["no_peserta"],
  });
  // console.log(lastPeserta.no_peserta);

  if (lastPeserta) {
    peserta.no_peserta = lastPeserta.no_peserta + 1;
  } else {
    peserta.no_peserta = 1001;
  }

  peserta.password = await bcrypt.hash(peserta.password, 12);
});

module.exports = Peserta;
