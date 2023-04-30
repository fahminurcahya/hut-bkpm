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

module.exports = {
  viewCheckin,
  viewStarterkit,
};
