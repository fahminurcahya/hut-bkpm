const Pendamping = require("../models/Pendamping");
const Peserta = require("../models/Peserta");

const viewCheckin = async (req, res) => {
  try {
    res.render("admin/checkin", {
      title: "HUT 50 | BKPM",
    });
  } catch (error) {
    console.log(error);
    res.redirect("/pageadm/peserta");
  }
};

const viewStarterkit = async (req, res) => {
  try {
    res.render("admin/starterkit", {
      title: "HUT 50 | BKPM",
    });
  } catch (error) {
    console.log(error);
    res.redirect("/pageadm/peserta");
  }
};

const viewScan = async (req, res) => {
  try {
    let id = "abfeed5a-c5d0-4028-bf08-2565a7ec57e7";
    const peserta = await Peserta.findOne({
      where: { id },
    });

    const pendamping = await Pendamping.findAll({
      where: { id_peserta: id },
    });
    console.log(pendamping);
    res.render("admin/scan", {
      title: "HUT 50 | BKPM",
      peserta,
      pendamping,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/pageadm/peserta");
  }
};

module.exports = {
  viewCheckin,
  viewStarterkit,
  viewScan,
};
