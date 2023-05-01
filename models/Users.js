const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../configs/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "users",
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
  },
  {
    timestamps: false,
    underscored: false,
  }
);

User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 12);
});

module.exports = User;
