const express = require("express");
const cors = require("cors");

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/service.routes");
const userRoutes = require("./routes/User.routes");
const orderRoutes = require("./routes/order.routes"); 


const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // ✅ en lugar de body-parser
app.use(express.urlencoded({ extended: true })); // Para manejar formularios

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Ruta raíz para probar servidor
app.get("/", (req, res) => {
  res.send("🚀 API TechNova Solutions corriendo correctamente");
});

module.exports = app;
