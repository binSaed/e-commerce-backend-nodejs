const _ = require("lodash");
const Category = require("../../models/category");
const Image = require("../../models/image");
const { deleteImageById } = require("../../utils/image_util");
const { addItemToCategory } = require("../utils");
const errorThrower = require("../../utils/error_thrower");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate({
        path: "image",
        select: "-_id -deletehash -__v",
      })
      .select("-__v -items");

    return res.jsonSuccess({ categories: categories });
  } catch (e) {
    next(e);
  }
};
exports.addCategory = async (req, res, next) => {
  let imageId;
  try {
    const { name } = req.body;
    const file = req.file;
    if (file) {
      const image = new Image({
        ..._.pick(file, ["deletehash", "link", "imageHash"]),
      });
      await image.save();
      imageId = image._id;
    }
    const category = new Category({ name, image: imageId });
    await category.save();

    return res.jsonSuccess();
  } catch (e) {
    deleteImageById({ id: imageId });
    next(e);
  }
};

exports.addItemToCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { itemId } = req.body;
    const isAdded = await addItemToCategory({ categoryId, itemID: itemId });
    if (isAdded) return res.jsonSuccess();
    return errorThrower("Category not found", 404);
  } catch (e) {
    next(e);
  }
};
