const User = require("../models/Users");

const viewSignin = async (req, res) => {
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    if (req.session.user == null || req.session.user == undefined) {
      res.render("admin/login", {
        alert,
        title: "Login",
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("alertMessage", "User yang anda masukan tidak ada!!");
      req.flash("alertStatus", "danger");
      return res.redirect("/pageadm/signin");
    }
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
  } catch (error) {
    res.redirect("/pageadm/signin");
  }
};

module.exports = {
  viewSignin,
  actionSignin,
};
