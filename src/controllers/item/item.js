const _ = require("lodash");
const Category = require("../../models/category");
const Item = require("../../models/item");
const Image = require("../../models/image");
const { deleteImageById } = require("../../utils/image_util");
const errorThrower = require("../../utils/error_thrower");
const { addItemToCategory } = require("../utils");

exports.addItem = async (req, res, next) => {
  try {
    const files = req.files;
    let images = [];
    if (files && files.length > 0) {
      images = files.map(
        (image) =>
          new Image({ ..._.pick(image, ["deletehash", "link", "imageHash"]) })
      );
      images.forEach((image) => image.save()); //save images to DB
    }

    const {
      title,
      disc,
      unitName,
      price,
      discount,
      maxQuantityInOrder,
      categoryId,
    } = req.body;

    const imagesIDs = images.map((image) => image._id);
    const item = new Item({
      title,
      disc,
      units: [
        {
          name: unitName,
          price,
          discount,
          maxQuantityInOrder,
          images: imagesIDs,
        },
      ],
    });

    await addItemToCategory({ categoryId: categoryId, itemID: item._id });
    await item.save();

    return res.jsonSuccess();
  } catch (e) {
    next(e);
  }
};
exports.getAllItems = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const categories = await Category.findById(categoryId)
      .populate({
        path: "items",
        populate: {
          path: "units.images",
          model: "Image",
          select: "-_id -deletehash -__v",
        },
      })
      .select("items");
    if (!categories) {
      return errorThrower("Category not found", 404);
    }
    return res.jsonSuccess({ items: categories?.items ?? [] });
  } catch (e) {
    next(e);
  }
};
