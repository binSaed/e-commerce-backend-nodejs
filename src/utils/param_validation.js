const { validationResult } = require("express-validator");
const errorThrower = require("../utils/error_thrower");

module.exports = (req, res, next) => {
  const errors = validationResult(req)
    .array({ onlyFirstError: true })
    .map((error) => `param ${error.param} ${error.msg}`)
    .join(" && ");
  if (errors.length > 0) {
    errorThrower(errors, 422);
  }
  next();
};
