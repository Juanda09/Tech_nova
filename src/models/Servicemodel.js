const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del servicio es obligatorio"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
    },
    stock: {
      type: Number,
      required: [true, "La cantidad en stock es obligatoria"],
      default: 0,
    },
    promo: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Servicio+TechNova",
    },
    imageId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
