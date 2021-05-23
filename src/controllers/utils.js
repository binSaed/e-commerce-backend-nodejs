const User = require("../models/user");
const Item = require("../models/item");
const Category = require("../models/category");
const Image = require("../models/image");
const { jwtSign, jwtVerify } = require("../utils/jwt_promise");
const errorThrower = require("../utils/error_thrower");

exports.addItemToCategory = async ({ categoryId, itemID }) => {
  if (!categoryId || !itemID) return;

  const category = await Category.findById(categoryId);
  if (category) {
    category.items.push(itemID);
    category.save();
  }
};
