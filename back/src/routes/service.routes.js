const express = require("express");
const { verificarToken, verificarAdmin } = require("../middlewares/auth");
const uploadService = require("../middlewares/UploadService");
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/Service.controller");

const router = express.Router();

router.get("/", getServices); // Público
router.post("/", verificarToken, verificarAdmin, uploadService.single("image"), createService);
router.put("/:id", verificarToken, verificarAdmin, uploadService.single("image"), updateService);
router.delete("/:id", verificarToken, verificarAdmin, deleteService);

module.exports = router;
