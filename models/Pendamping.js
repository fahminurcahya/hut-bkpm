const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../configs/db");

const Pendamping = sequelize.define(
  "pendamping",
  {
    id_peserta: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    id_pendamping: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ukuran: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: false,
    freezeTableName: true
  }
);

module.exports = Pendamping;
