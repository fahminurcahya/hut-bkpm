const router = require("express").Router();
const pesertaController = require("../controllers/api/PesertaController");
const tiketController = require("../controllers/api/TiketController");

router.post("/register", pesertaController.register);
router.get("/peserta/:id", pesertaController.getDetail);
router.get("/tiket/:qr_code", tiketController.getData);
router.post("/claim_racepack/:qr_code", tiketController.claimRacePack);
router.post("/checkin/:qr_code", tiketController.checkin);
router.post("/peserta", pesertaController.getAll);

module.exports = router;
