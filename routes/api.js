const router = require("express").Router();
const pesertaController = require("../controllers/api/PesertaController");
const tiketController = require("../controllers/api/TiketController");
const userController = require("../controllers/api/UserController");

router.post("/register", pesertaController.register);
router.get("/peserta/:id", pesertaController.getDetail);
router.post("/tiket/:qr_code", tiketController.getData);
router.post("/send/:email", tiketController.sendMail);

router.post("/claim_racepack/:qr_code", tiketController.claimRacePack);
router.post("/checkin/:qr_code", tiketController.checkin);
router.post("/peserta", pesertaController.getAll);
router.get("/createuser", userController.register);

module.exports = router;
