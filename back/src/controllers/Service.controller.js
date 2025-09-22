const Service = require("../models/Servicemodel");
const cloudinary = require("../config/cloudinary");

// Obtener todos los servicios
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios", error: error.message });
  }
};

// Crear un nuevo servicio
const createService = async (req, res) => {
  try {
    let imageUrl = "https://via.placeholder.com/300x200?text=Servicio+TechNova";
    let imageId = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "tecnova-services",
      });
      imageUrl = uploadResult.secure_url;
      imageId = uploadResult.public_id;
    }

    const newService = new Service({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      promo: req.body.promo,
      description: req.body.description,
      imageUrl,
      imageId,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: "Error al crear servicio", error: error.message });
  }
};

// Actualizar un servicio existente
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Servicio no encontrado" });

    // Si hay nueva imagen, eliminar la anterior de Cloudinary
    if (req.file) {
      if (service.imageId) {
        await cloudinary.uploader.destroy(service.imageId);
      }
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "tecnova-services",
      });
      service.imageUrl = uploadResult.secure_url;
      service.imageId = uploadResult.public_id;
    }

    // Actualizar otros campos
    service.name = req.body.name || service.name;
    service.price = req.body.price || service.price;
    service.stock = req.body.stock || service.stock;
    service.promo = req.body.promo ?? service.promo;
    service.description = req.body.description || service.description;

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar servicio", error: error.message });
  }
};

// Eliminar un servicio
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Servicio no encontrado" });

    if (service.imageId) {
      await cloudinary.uploader.destroy(service.imageId);
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar servicio", error: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
