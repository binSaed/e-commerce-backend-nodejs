const { Router } = require("express");
const checkPermissions = require("../middlewares/check_permissions");
const isIntl = require("../middlewares/is_intl");
const paramValidator = require("../middlewares/param_validator");
const paramValidation = require("../utils/param_validation");
const imageUploader = require("../middlewares/uploader/image_uploader");
const { addItem, getAllItems } = require("../controllers/item/item");

const router = Router();

router.post(
  "/add",
  checkPermissions("addItem"),
  imageUploader.array,
  isIntl("title"),
  isIntl("disc"),
  isIntl("unitName"),
  paramValidator.bodyPrice,
  paramValidation,
  addItem
);

router.get("/getAll/:id", paramValidator.paramId, paramValidation, getAllItems);

module.exports = router;
