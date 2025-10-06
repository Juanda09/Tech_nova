const User = require("../models/Usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// Registrar usuario
const register = async (req, res) => {
  console.log("📥 Datos recibidos en el register:", req.body);

  const { username, email, password, role, fullName, phone } = req.body;

  try {
    // Validar campos requeridos
    if (!username || !email || !password) {
      console.warn("⚠️ Faltan campos obligatorios:", { username, email, password });
      return res.status(400).json({ message: "Username, email y password son obligatorios" });
    }

    // Validar si el usuario o correo ya existen
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.warn("⚠️ Usuario o correo ya registrado:", { username, email });
      return res.status(400).json({ message: "Usuario o correo ya registrado" });
    }

    // Subir avatar a Cloudinary si se envía archivo
    let avatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    let avatarId = null;

    if (req.file) {
      console.log("📤 Subiendo avatar a Cloudinary...");
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

    console.log("✅ Usuario registrado correctamente:", {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en el registro:", err.message);
    res.status(500).json({ message: "Error en el registro", error: err.message });
  }
};

/// Login usuario
const login = async (req, res) => {
  console.log("📥 Datos recibidos en el login:", req.body);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username y password son obligatorios" });
    }

    // 🔑 Buscar por username o email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

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
    console.error("❌ Error en login:", err.message);
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
    console.error("❌ Error al obtener perfil:", err.message);
    res.status(500).json({ message: "Error al obtener perfil", error: err.message });
  }
};

module.exports = { register, login, getProfile };
