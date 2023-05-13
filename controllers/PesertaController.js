const Peserta = require("../models/Peserta");
const { generateQRPNG } = require("../utils/generateQRPNG");
const {
  send,
  sendQRPNG,
  sendQRBase64,
  sendQRAttach,
  sendQRAttachWithGeneratePdf,
  sendNotifAdmin,
  generatePDF,
} = require("../mail");
const bcrypt = require("bcryptjs");
const Pendamping = require("../models/Pendamping");
const sequelize = require("../configs/db");

// const { generatePDF } = require("../utils/generatePDF");

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

const viewFunRun = async (req, res) => {
  try {
    const peserta = await Peserta.findAll({
      where: {
        event: "fr",
      },
      order: [["no_peserta", "ASC"]],
    });

    res.render("admin/funrun", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/pageadm/funrun");
  }
};

const viewFunWalk = async (req, res) => {
  try {
    const peserta = await Peserta.findAll({
      where: {
        event: "fw",
      },
      order: [["no_peserta", "ASC"]],
    });

    res.render("admin/funwalk", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/pageadm/funwalk");
  }
};

const viewEmail = async (req, res) => {
  try {
    const peserta = await Peserta.findAll({
      where: {
        flag_email: false,
      },
      order: [["no_peserta", "ASC"]],
    });

    res.render("admin/email", {
      title: "HUT 50 | BKPM",
      peserta,
    });
  } catch (error) {
    res.redirect("/pageadm/email");
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
    jenkel,
    departement,
    alamat,
    flag_internal,
    golongan_darah,
    nama_darurat,
    hubungan,
    alamat_darurat,
    no_hp_darurat,
    nik,
    pendamping,
  } = req.body;
  const t = await sequelize.transaction();

  try {
    // console.log(req.body);

    let dataPeserta = {
      no_peserta: 101,
      event,
      nama,
      no_whatsapp,
      ukuran,
      email,
      password,
      nip,
      jenkel,
      departement,
      alamat,
      flag_internal,
      qr_code: "",
      golongan_darah,
      nik,
      nama_darurat,
      hubungan,
      no_hp_darurat,
      alamat_darurat,
      pendamping,
    };
    const peserta = await Peserta.create(dataPeserta, { transaction: t });

    if (event === "fw" && flag_internal) {
      if (pendamping == "Y") {
        const {
          nama_pendamping_1,
          nama_pendamping_2,
          nama_pendamping_3,
          nama_pendamping_4,
          nama_pendamping_5,
          ukuran_1,
          ukuran_2,
          ukuran_3,
          ukuran_4,
          ukuran_5,
        } = req.body;

        let dataPendamping = {};
        let namap = [];
        for (let x = 1; x <= 5; x++) {
          switch (x) {
            case 1:
              if(nama_pendamping_1!='' && ukuran_1!=''){
                namap.push({ nama: nama_pendamping_1, ukuran: ukuran_1 });
              }
              break;
            case 2:
              if(nama_pendamping_2!='' && ukuran_2!=''){
                namap.push({ nama: nama_pendamping_2, ukuran: ukuran_2 });
              }
              break;
            case 3:
              if(nama_pendamping_3!='' && ukuran_3!=''){
                namap.push({ nama: nama_pendamping_3, ukuran: ukuran_3 });
              }
              break;
            case 4:
              if(nama_pendamping_4!='' && ukuran_4!=''){
                namap.push({ nama: nama_pendamping_4, ukuran: ukuran_4 });
              }
              break;
            case 5:
              if(nama_pendamping_5!='' && ukuran_5!=''){
                namap.push({ nama: nama_pendamping_5, ukuran: ukuran_5 });
              }
              break;
          }
        }

        // console.log(namap);
        // console.log(namap.length);

        for (let i = 0; i < namap.length; i++) {
          if (
            namap[i].nama != "" &&
            namap[i].nama != undefined &&
            namap[i].nama != null
          ) {
            dataPendamping.id_peserta = peserta.id;
            dataPendamping.id_pendamping = i + 1;
            dataPendamping.nama = namap[i].nama;
            dataPendamping.ukuran = namap[i].ukuran;
            console.log(dataPendamping);
            const pendamping = await Pendamping.create(dataPendamping, {
              transaction: t,
            });
          }
        }
      }
    }

    await generateQRPNG(peserta.no_peserta, peserta.qr_code, peserta.event);
    generatePDF(email, peserta.no_peserta, peserta.nama, event);
    sendNotifAdmin(email, peserta.no_peserta, peserta.nama, event);
    await t.commit();

    // if (event === "fw" && flag_internal) {
    //   const {
    //     nama_pendamping_1,
    //     nama_pendamping_2,
    //     nama_pendamping_3,
    //     nama_pendamping_4,
    //     nama_pendamping_5,
    //     ukuran_1,
    //     ukuran_2,
    //     ukuran_3,
    //     ukuran_4,
    //     ukuran_5,
    //   } = req.body;

    //   let dataPendamping = {};

    //   for (let i = 1; i <= 5; i++) {
    //     if (
    //       nama_pendamping_ + i != undefined ||
    //       nama_pendamping_ + i != null ||
    //       nama_pendamping_ + i != ""
    //     ) {
    //       dataPendamping.id_peserta = peserta.id;
    //       dataPendamping.id_pendamping = i;
    //       dataPendamping.nama = nama_pendamping_ + i;
    //       dataPendamping.ukuran = ukuran_ + i;
    //       console.log(dataPendamping);
    //       const pendamping = await Pendamping.create(dataPendamping);
    //     }
    //   }
    // }

    // --- send qr dengan base 64 ---
    // const qr = await QRCode.toDataURL(peserta.qr_code);
    // peserta.qr = qr;
    // await sendQRBase64(email, peserta);

    // await generateQRPNG(peserta.no_peserta, peserta.qr_code); here

    // await generatePDF(peserta.no_peserta, event);

    // await sendQRPNG(email, peserta);
    // await sendQRAttach(email, peserta);

    // await generatePDF(email, peserta.no_peserta, peserta.nama, event); here
    // await sendNotifAdmin(email, peserta.no_peserta, peserta.nama, event); here

    req.flash(
      "alertMessage",
      "Berhasil mendaftar, silahkan cek email atau login untuk mendapatkan barcode"
    );
    req.flash("alertStatus", "success");
    res.redirect("/signin");
  } catch (err) {
    await t.rollback();

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

    const pendamping = await Pendamping.findAll({
      where: { id_peserta: id },
    });
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/detail", {
      title: "HUT 50 | BKPM",
      peserta,
      pendamping,
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

    const pendamping = await Pendamping.findAll({
      where: { id_peserta: id },
    });
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    console.log(pendamping);
    res.render("peserta", {
      title: "HUT 50 | BKPM",
      peserta,
      pendamping,
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

const getKuotaCounter = async (req, res) => {
  try {
    const Tfr = await Peserta.count({
      where: { event: 'fr' },
    });
    
    const Tfw = await Peserta.count({
      where: { event: 'fw' },
    });
    
    const Tin = await Peserta.count({
      where: { flag_internal: '1' },
    });
    
    const Toeks = await Peserta.count({
      where: { flag_internal: '0' },
    });

    const pendamping = await Pendamping.count();
    
    const Totalin   = pendamping+Tin;
    const Totalfw   = Tfw+pendamping;

    const Counter = {Totalin, Toeks, Tfr, Totalfw, pendamping, Tin, Tfw};
    
    // console.log(Counter);

    res.render("index", {
      title: "HUT 50 | BKPM",
      Counter,
    });
  } catch (error) {
    // res.redirect("/");
    console.log(error);
  }
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
  viewFunRun,
  viewFunWalk,
  viewEmail,
  getKuotaCounter,
};
