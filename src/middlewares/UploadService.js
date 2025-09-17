const multer = require("multer");

const storage = multer.diskStorage({});
const uploadService = multer({ storage });

module.exports = uploadService;
