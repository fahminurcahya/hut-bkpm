const Peserta = require("../models/Peserta");
const { generateQRPNG } = require("../utils/generateQRPNG");
const {
  send,
  sendQRPNG,
  sendQRBase64,
  sendQRAttach,
  sendQRAttachWithGeneratePdf,
} = require("../mail");
const bcrypt = require("bcryptjs");
const { generatePDF } = require("../utils/generatePDF");

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
    if (req.session.peserta == null || req.session.peserta == undefined) {
      res.render("register", {
        alert,
        title: "HUT 50 | BKPM",
      });
    } else {
      res.redirect("/peserta");
    }
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/pageadm/signin");
  }
};

const register = async (req, res) => {
  const {
    event,
    nama,
    no_whatsapp,
    ukuran,
    email,
    password,
    nip,
    umur,
    jenkel,
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
      umur: umur == "" ? null : umur,
      jenkel,
      departement,
      alamat,
      flag_internal,
      qr_code: "",
    };
    const peserta = await Peserta.create(dataPeserta);

    // --- send qr dengan base 64 ---
    // const qr = await QRCode.toDataURL(peserta.qr_code);
    // peserta.qr = qr;
    // await sendQRBase64(email, peserta);

    await generateQRPNG(peserta.no_peserta, peserta.qr_code);
    // await generatePDF(peserta.no_peserta, event);

    // await sendQRPNG(email, peserta);
    // await sendQRAttach(email, peserta);
    await sendQRAttachWithGeneratePdf(email, peserta.no_peserta, event);

    req.flash(
      "alertMessage",
      "Berhasil mendaftar, silahkan cek email atau login untuk mendapatkan barcode"
    );
    req.flash("alertStatus", "success");
    res.redirect("/signin");
  } catch (err) {
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

    req.flash("alertMessage", `${err.message}`);
    req.flash("alertStatus", "danger");
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
      title: "HUT 50 | BKPM",
      peserta,
      alert,
    });
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/pageadm/signin");
  }
};

const viewDetail = async (req, res) => {
  try {
    let id = req.session.peserta.id;
    const peserta = await Peserta.findOne({
      where: { id },
    });
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("peserta", {
      title: "HUT 50 | BKPM",
      peserta,
      alert,
    });
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/signin");
  }
};

const viewSignin = async (req, res) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    if (req.session.peserta == null || req.session.peserta == undefined) {
      res.render("signin", {
        alert,
        title: "HUT 50 | BKPM",
      });
    } else {
      res.redirect("/peserta");
    }
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/signin");
  }
};

const actionSignin = async (req, res) => {
  try {
    const { email_address, password } = req.body;

    // const peserta = await Peserta.findOne({
    //   email: email_address,
    // });
    const peserta = await Peserta.findOne({
      where: {
        email: email_address,
      },
    });

    // console.log(peserta);
    if (peserta != null) {
      const isPasswordMatch = await bcrypt.compare(password, peserta.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Password yang anda masukan tidak cocok!!");
        req.flash("alertStatus", "danger");
        return res.redirect("/signin");
      }
      req.session.peserta = {
        id: peserta.id,
        email: peserta.email,
      };
      res.redirect("/peserta");
    } else {
      req.flash("alertMessage", "Email yang anda masukan tidak terdaftar!!");
      req.flash("alertStatus", "danger");
      return res.redirect("/signin");
    }
  } catch (error) {
    req.flash("alertMessage", error.message || "Internal Server");
    req.flash("alertStatus", "danger");
    res.redirect("/signin");
  }
};

const actionLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/signin");
};

module.exports = {
  viewPeserta,
  viewExternal,
  viewInternal,
  register,
  viewRegister,
  getDetail,
  viewDetail,
  viewSignin,
  actionSignin,
  actionLogout,
};
