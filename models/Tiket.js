const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Peserta = require("./Peserta");

const Tiket = sequelize.define(
  "tiket",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_peserta: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Peserta,
        key: "id",
      },
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    flag_racepack: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    racepack_updated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    flag_checkin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    checkin_updated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },

  {
    timestamps: true,
    underscored: true,
  }
);

// set relasi one to one pada model tiket dan peserta
// Tiket.belongsTo(Peserta, { foreignKey: "id_peserta", targetKey: "id" });
Tiket.beforeCreate(async (tiket, options) => {
  // generate random key
  const keyLength = 10;
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let qrCode = "";
  for (let i = 0; i < keyLength; i++) {
    qrCode += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  tiket.qr_code = qrCode;
});

module.exports = Tiket;
