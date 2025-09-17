const express = require("express");
const { register, login, getProfile } = require("../controllers/Auth.controller");
const { verificarToken, verificarAdmin } = require("../middlewares/auth");
const uploadUser = require("../middlewares/uploadUser");

const router = express.Router();

router.post("/register", uploadUser.single("avatar"), register);
router.post("/login", login);
router.get("/profile", verificarToken, getProfile);

// Ejemplo extra: solo admin puede ver todos los usuarios
// router.get("/all", verificarToken, verificarAdmin, getAllUsers);

module.exports = router;
