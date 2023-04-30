const router = require("express").Router();
const pesertaController = require("../controllers/PesertaController");
const tiketController = require("../controllers/TiketController");

// router.get("/signin", pesertaController.viewSignin);
router.get("/peserta", pesertaController.viewPeserta);
router.get("/internal", pesertaController.viewInternal);
router.get("/external", pesertaController.viewExternal);
router.get("/starterkit", tiketController.viewStarterkit);
router.get("/checkin", tiketController.viewCheckin);

module.exports = router;
