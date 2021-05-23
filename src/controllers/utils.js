const User = require("../models/user");
const Item = require("../models/item");
const Category = require("../models/category");
const Image = require("../models/image");
const { jwtSign, jwtVerify } = require("../utils/jwt_promise");
const errorThrower = require("../utils/error_thrower");

exports.addItemToCategory = async ({ categoryId, itemID }) => {
  if (!categoryId || !itemID) return false;

  const category = await Category.findById(categoryId);
  if (!category) return false;

  // I am not sure we need validation for itemId
  // to be sure the item exists or not, for now
  // I insert itemId without validation
  //if u read this comment let me know ur opinion, Good Day

  category.items.push(itemID);
  category.save();
  return true;
};
