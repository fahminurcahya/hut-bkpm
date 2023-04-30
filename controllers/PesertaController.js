const sequelize = require("../configs/db");

const viewPeserta = async (req, res) => {
  try {
    const peserta = await sequelize.query(
      `
      SELECT peserta.*, NULL AS password, tikets.qr_code
      FROM peserta
      JOIN tikets ON peserta.id = tikets.id_peserta
    `,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.render("admin/peserta", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    console.log(error);
    // res.redirect("/pageadm/peserta");
  }
};

const viewExternal = async (req, res) => {
  try {
    const peserta = await sequelize.query(
      `
      SELECT peserta.*, NULL AS password, tikets.qr_code
      FROM peserta
      JOIN tikets ON peserta.id = tikets.id_peserta
      WHERE peserta.flag_internal = false
    `,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.render("admin/external", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/admin/dashboard");
  }
};

const viewInternal = async (req, res) => {
  try {
    const peserta = await sequelize.query(
      `
      SELECT peserta.*, NULL AS password, tikets.qr_code
      FROM peserta
      JOIN tikets ON peserta.id = tikets.id_peserta
      WHERE peserta.flag_internal = true
    `,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.render("admin/internal", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/admin/dashboard");
  }
};

module.exports = { viewPeserta, viewExternal, viewInternal };
