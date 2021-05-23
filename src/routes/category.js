const { Router } = require("express");
const checkPermissions = require("../middlewares/check_permissions");
const isIntl = require("../middlewares/is_intl");
const imageUploader = require("../middlewares/uploader/image_uploader");
const {
  addCategory,
  addItemToCategory,
  getCategories,
} = require("../controllers/category/category");
const paramValidator = require("../middlewares/param_validator");
const paramValidation = require("../utils/param_validation");

const router = Router();

//create category
router.post(
  "/add",
  checkPermissions("addCategory"),
  imageUploader.single,
  isIntl("name"),
  addCategory
);
//add an item to an existing category
router.post(
  "/:categoryId/addItem",
  checkPermissions("addItemToCategory"),
  paramValidator.paramMongoId("categoryId"),
  paramValidator.bodyMongoId("itemId"),
  paramValidation,
  addItemToCategory
);
router.get("/getAll", getCategories);

module.exports = router;
