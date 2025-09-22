const User = require("../models/Usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// Registrar usuario
const register = async (req, res) => {
  const { username, email, password, role, fullName, phone } = req.body;

  try {
    // Validar si el usuario o correo ya existen
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario o correo ya registrado" });
    }

    // Subir avatar a Cloudinary si se envía archivo
    let avatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    let avatarId = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "tecnova-users",
      });
      avatarUrl = uploadResult.secure_url;
      avatarId = uploadResult.public_id;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      fullName,
      phone,
      avatar: avatarUrl,
      avatarId,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error en el registro", error: err.message });
  }
};

// Login usuario
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error en el login", error: err.message });
  }
};

// Obtener perfil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener perfil", error: err.message });
  }
};

module.exports = { register, login, getProfile };
