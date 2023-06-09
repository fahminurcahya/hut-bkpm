var express = require("express");
var pesertaController = require("../controllers/PesertaController");
var router = express.Router();
const { isLoginPeserta } = require("../middlewares/auth");

/* GET home page. */
router.get("/", pesertaController.getKuotaCounter);

router.get("/tiket", function (req, res, next) {
  res.render("pdf/tiket_fr", { title: "HUT 50 | BKPM" });
});

router.get("/signin", pesertaController.viewSignin);
router.get("/register", pesertaController.viewRegister);
router.post("/register", pesertaController.register);
router.post("/signin", pesertaController.actionSignin);
router.get("/signout", isLoginPeserta, pesertaController.actionLogout);

router.get("/peserta", isLoginPeserta, pesertaController.viewDetail);

module.exports = router;
