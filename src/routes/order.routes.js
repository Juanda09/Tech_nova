const express = require("express");
const { verificarToken, verificarAdmin } = require("../middlewares/auth");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/Order.controller");

const router = express.Router();

// Crear pedido (usuario autenticado)
router.post("/", verificarToken, createOrder);

// Obtener mis pedidos
router.get("/my-orders", verificarToken, getMyOrders);

// Obtener todos los pedidos (solo admin)
router.get("/", verificarToken, verificarAdmin, getAllOrders);

// Actualizar estado del pedido (solo admin)
router.put("/:id", verificarToken, verificarAdmin, updateOrderStatus);

module.exports = router;
