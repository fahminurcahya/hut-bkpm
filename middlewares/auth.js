const isLoginAdmin = (req, res, next) => {
  if (req.session.user == null || req.session.user == undefined) {
    req.flash("alertMessage", "Session telah habis silahkan signin kembali!!");
    req.flash("alertStatus", "danger");
    res.redirect("/pageadm/signin");
  } else {
    next();
  }
};

const isLoginPeserta = (req, res, next) => {
  if (req.session.peserta == null || req.session.peserta == undefined) {
    req.flash("alertMessage", "Session telah habis silahkan signin kembali!!");
    req.flash("alertStatus", "danger");
    res.redirect("/signin");
  } else {
    next();
  }
};

module.exports = { isLoginAdmin, isLoginPeserta };
