const jwt = require("jsonwebtoken");

// Verificar que el usuario tenga un token válido
const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(403).json({ message: "Acceso denegado, token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardamos el payload en la request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Verificar que el usuario tenga rol de administrador
const verificarAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado, solo administradores" });
  }
  next();
};

module.exports = { verificarToken, verificarAdmin };
