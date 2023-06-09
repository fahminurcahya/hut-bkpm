const router = require("express").Router();
const pesertaController = require("../controllers/PesertaController");
const tiketController = require("../controllers/TiketController");
const userController = require("../controllers/UserController");
const { isLoginAdmin } = require("../middlewares/auth");

router.get("/peserta", isLoginAdmin, pesertaController.viewPeserta);
router.get("/participant", isLoginAdmin, pesertaController.viewAllPeserta);

router.get("/internal", isLoginAdmin, pesertaController.viewInternal);
router.get("/external", isLoginAdmin, pesertaController.viewExternal);
router.get("/funwalk", isLoginAdmin, pesertaController.viewFunWalk);
router.get("/funrun", isLoginAdmin, pesertaController.viewFunRun);
router.get("/email", isLoginAdmin, pesertaController.viewEmail);

router.get("/starterkit", isLoginAdmin, tiketController.viewStarterkit);
router.get("/checkin", isLoginAdmin, tiketController.viewCheckin);
router.get("/scan", isLoginAdmin, tiketController.viewScan);

router.get("/signin", userController.viewSignin);
router.post("/signin", userController.actionSignin);
router.get("/detail/:id", isLoginAdmin, pesertaController.getDetail);
router.get("/logout", isLoginAdmin, userController.actionLogout);

module.exports = router;
