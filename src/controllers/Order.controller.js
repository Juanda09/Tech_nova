const Order = require("../models/OrderModel");
const Service = require("../models/Servicemodel");

// Crear un pedido
const createOrder = async (req, res) => {
  try {
    const { services } = req.body; // [{ service, quantity }]
    if (!services || services.length === 0) {
      return res.status(400).json({ message: "El pedido debe incluir servicios" });
    }

    let total = 0;

    for (const item of services) {
      const service = await Service.findById(item.service);
      if (!service) {
        return res.status(404).json({ message: `Servicio no encontrado: ${item.service}` });
      }
      total += service.price * item.quantity;
    }

    const newOrder = new Order({
      user: req.user.id,
      services,
      total,
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Error al crear pedido", error: err.message });
  }
};

// Obtener pedidos de un usuario
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("services.service", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener pedidos", error: err.message });
  }
};

// Obtener todos los pedidos (solo admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("services.service", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener todos los pedidos", error: err.message });
  }
};

// Actualizar estado del pedido (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    order.status = status || order.status;
    await order.save();

    res.json({ message: "Estado actualizado", order });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar pedido", error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
