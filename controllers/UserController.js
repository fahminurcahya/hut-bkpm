const User = require("../models/Users");
const bcrypt = require("bcryptjs");

const viewSignin = async (req, res) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    if (req.session.user == null || req.session.user == undefined) {
      res.render("admin/login", {
        alert,
        title: "HUT 50 | BKPM",
      });
    } else {
      res.redirect("/pageadm/peserta");
    }
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/pageadm/signin");
  }
};

const actionSignin = async (req, res) => {
  try {
    const { email_address, password } = req.body;

    console.log(email_address);
    const user = await User.findOne({
      where: {
        email: email_address,
      },
    });

    console.log(user);
    if(user!=null){
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Password yang anda masukan tidak cocok!!");
        req.flash("alertStatus", "danger");
        return res.redirect("/pageadm/signin");
      }
      req.session.user = {
        id: user.id,
        email: user.email,
      };
      res.redirect("/pageadm/peserta");
    }else{
      req.flash("alertMessage", "Email yang anda masukan tidak terdaftar!!");
      req.flash("alertStatus", "danger");
      return res.redirect("/pageadm/signin");
    }
  } catch (error) {
    req.flash("alertMessage", error.message || "Internal Server");
    req.flash("alertStatus", "danger");
    res.redirect("/pageadm/signin");
  }
};

const actionLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/pageadm/signin");
};

module.exports = {
  viewSignin,
  actionSignin,
  actionLogout,
};
