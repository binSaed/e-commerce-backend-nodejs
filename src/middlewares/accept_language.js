const mongoose = require("mongoose");
const CONSTANT = require("../constants/constant");

const acceptLanguage = (req, res, next) => {
  const userLanguage = req.get("accept-language");
  const acceptedLanguage = CONSTANT.LANGUAGES.includes(userLanguage);

  req.userLanguage = acceptedLanguage
    ? userLanguage
    : CONSTANT.DEFAULT_LANGUAGE;

  mongoose.setDefaultLanguage(req.userLanguage);

  return next();
};
module.exports = acceptLanguage;
