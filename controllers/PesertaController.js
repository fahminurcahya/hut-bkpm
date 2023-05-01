const Peserta = require("../models/Peserta");
const { generateQRPNG } = require("../utils/generateQRPNG");
const { send, sendQRPNG, sendQRBase64, sendQRAttach } = require("../mail");

const viewPeserta = async (req, res) => {
  try {
    const peserta = await Peserta.findAll({
      order: [["no_peserta", "ASC"]],
    });
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
      order: [["no_peserta", "ASC"]],
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
      order: [["no_peserta", "ASC"]],
    });
    res.render("admin/internal", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/");
  }
};

const viewRegister = async (req, res) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };

    res.render("register", {
      alert,
      title: "Register",
    });
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/pageadm/signin");
  }
};

const register = async (req, res) => {
  console.log(req.body);
  const {
    event,
    nama,
    no_whatsapp,
    ukuran,
    email,
    password,
    nip,
    umur,
    departement,
    alamat,
    flag_internal,
  } = req.body;
  try {
    let dataPeserta = {
      no_peserta: 101,
      event,
      nama,
      no_whatsapp,
      ukuran,
      email,
      password,
      nip,
      umur,
      departement,
      alamat,
      flag_internal,
      qr_code: "",
    };

    const peserta = await Peserta.create(dataPeserta);

    let result = {
      peserta,
    };

    // --- send qr dengan base 64 ---
    // const qr = await QRCode.toDataURL(peserta.qr_code);
    // peserta.qr = qr;
    // await sendQRBase64(email, peserta);

    await generateQRPNG(peserta.no_peserta, peserta.qr_code);

    // await sendQRPNG(email, peserta);
    await sendQRAttach(email, peserta);

    req.flash("alertMessage", "Succesfully Register");
    req.flash("alertStatus", "Success");
    res.redirect("/register");
  } catch (err) {
    // console.log(email);
    if (err.name != "validation") {
      const peserta = await Peserta.findOne({
        where: { email },
      });

      await Peserta.destroy({
        where: {
          email,
        },
        force: true,
      });
    }

    console.log(err);
    res.redirect("/register");
  }
};

const getDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const peserta = await Peserta.findOne({
      where: { id },
    });
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/detail", {
      title: "HUT 50th BKPM",
      peserta,
      alert,
    });
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/pageadm/signin");
  }
};

module.exports = {
  viewPeserta,
  viewExternal,
  viewInternal,
  register,
  viewRegister,
  getDetail,
};
