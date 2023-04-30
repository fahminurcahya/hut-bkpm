var express = require("express");
var pesertaController = require("../controllers/PesertaController");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/signin", function (req, res, next) {
  res.render("/admin/login", { title: "Login" });
});

router.get("/register", pesertaController.viewRegister);
router.post("/register", pesertaController.register);

module.exports = router;
