const _ = require("lodash");
const Category = require("../../models/category");
const Item = require("../../models/item");
const Image = require("../../models/image");
const { deleteImageById } = require("../../utils/image_util");

exports.addItem = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const categories = await Category.findById(categoryId)
      .populate({ path: "items" })
      .select("items");

    return res.jsonSuccess({ items: categories.items });
  } catch (e) {
    next(e);
  }
};
exports.getAllItems = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const categories = await Category.findById(categoryId)
      .populate({ path: "items" })
      .select("items");

    return res.jsonSuccess({ items: categories.items });
  } catch (e) {
    next(e);
  }
};
