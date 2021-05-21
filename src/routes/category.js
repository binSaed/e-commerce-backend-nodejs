const { Router } = require("express");
const checkPermissions = require("../middlewares/check_permissions");
const isIntl = require("../middlewares/is_intl");
const imageUploader = require("../middlewares/uploader/image_uploader");
const {
  addCategory,
  getCategories,
} = require("../controllers/category/category");

const router = Router();

router.post(
  "/add",
  checkPermissions("addCategory"),
  imageUploader.single,
  isIntl("name"),
  addCategory
);

router.get("/getAll", getCategories);

module.exports = router;
