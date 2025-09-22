const multer = require("multer");

const storage = multer.diskStorage({});
const uploadUser = multer({ storage });

module.exports = uploadUser;
