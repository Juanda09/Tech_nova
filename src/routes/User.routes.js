const express = require("express");
const { verificarToken, verificarAdmin } = require("../middlewares/auth");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/User.controller");

const router = express.Router();

// Solo admin puede manejar usuarios
router.get("/", verificarToken, verificarAdmin, getUsers);
router.get("/:id", verificarToken, verificarAdmin, getUserById);
router.put("/:id", verificarToken, verificarAdmin, updateUser);
router.delete("/:id", verificarToken, verificarAdmin, deleteUser);

module.exports = router;
