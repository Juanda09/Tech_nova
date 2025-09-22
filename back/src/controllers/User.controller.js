const User = require("../models/Usermodel");
const cloudinary = require("../config/cloudinary");

// Listar todos los usuarios (solo admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err.message });
  }
};

// Obtener un usuario por ID (solo admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuario", error: err.message });
  }
};

// Actualizar rol o estado de un usuario
const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();
    res.json({ message: "Usuario actualizado", user });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar usuario", error: err.message });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Eliminar avatar en Cloudinary si existe
    if (user.avatarId) {
      await cloudinary.uploader.destroy(user.avatarId);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario", error: err.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
