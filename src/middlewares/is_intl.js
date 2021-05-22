const CONSTANT = require("../constants/constant");
const errorThrower = require("../utils/error_thrower");
module.exports = (field) => {
  return async (req, res, next) => {
    try {
      //in some time when i use form-data
      //fields come as String for this i need to parse it

      let input = {};
      if (typeof req.body[field] === "object") {
        input = req.body[field];
      }
      if (typeof req.body[field] === "string") {
        input = JSON.parse(req.body[field]);
      }
      // input = { "en": "test", "ar": "تجربة" }

      req.body[field] = input;
      for (let i = 0; i < CONSTANT.LANGUAGES.length; i++) {
        if (!input[CONSTANT.LANGUAGES[i]]) {
          errorThrower(
            `one of needed ${field} languages not found=> ${CONSTANT.LANGUAGES}`,
            422
          );

          return;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
