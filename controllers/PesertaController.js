const sequelize = require("../configs/db");
const Peserta = require("../models/Peserta");

const viewPeserta = async (req, res) => {
  try {
    const peserta = await Peserta.findAll();
    res.render("admin/peserta", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/pageadm/peserta");
  }
};

const viewExternal = async (req, res) => {
  try {
    const peserta = await Peserta.findAll({
      where: {
        flag_internal: false,
      },
    });

    res.render("admin/external", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/pageadm/peserta");
  }
};

const viewInternal = async (req, res) => {
  try {
    const peserta = await Peserta.findAll({
      where: {
        flag_internal: true,
      },
    });
    res.render("admin/internal", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/admin/dashboard");
  }
};

module.exports = { viewPeserta, viewExternal, viewInternal };
