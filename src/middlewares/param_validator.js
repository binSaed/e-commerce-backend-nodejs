const { body, param, query, check } = require("express-validator");
const isMongoId = require("../utils/is_mongo_id");
const CONSTANT = require("../constants/constant");
const bodyEmail = body("email")
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage("must be a valid email.");

const bodyPassword = body("password")
  .trim()
  .isLength({
    min: CONSTANT.PASSWORD_MIN_LENGTH,
    max: CONSTANT.PASSWORD_MAX_LENGTH,
  })
  .withMessage(
    `length must be between ${CONSTANT.PASSWORD_MIN_LENGTH},${CONSTANT.PASSWORD_MAX_LENGTH}`
  );
const bodyFcmToken = body("fcmToken")
  .isString()
  .isLength({ min: 8 })
  .withMessage("must be a valid.");
const bodyName = body("name")
  .trim()
  .isLength({
    min: CONSTANT.NAME_MIN_LENGTH,
    max: CONSTANT.NAME_MAX_LENGTH,
  })
  .withMessage(
    `length must be between ${CONSTANT.NAME_MIN_LENGTH},${CONSTANT.NAME_MAX_LENGTH}`
  );
const bodyPhone = body("phone")
  .trim()
  .isMobilePhone(CONSTANT.PHONE_LOCAL)
  .withMessage(`must be ${CONSTANT.PHONE_LOCAL}`);
const bodyUserType = body("userType")
  .trim()
  .notEmpty()
  .custom((user) => CONSTANT.USER_TYPE.includes(user));
const queryRandomCode = query("code")
  .isLength({
    max: CONSTANT.RANDOM_CODE_LENGTH,
    min: CONSTANT.RANDOM_CODE_LENGTH,
  })
  .withMessage(`length must be ${CONSTANT.RANDOM_CODE_LENGTH} digits`)
  .trim()
  .isInt();

const queryToken = query("token").isJWT().withMessage(`is not valid`);
const queryConfirmEmailToken = query("confirmEmailToken")
  .isJWT()
  .withMessage(`is not valid`);
const queryResetPasswordToken = query("resetPasswordToken")
  .isJWT()
  .withMessage(`is not valid`);
const paramId = param("id").trim().custom(isMongoId);

const paramValidator = {
  bodyName,
  bodyFcmToken,
  bodyEmail,
  bodyPassword,
  bodyPhone,
  bodyUserType,
  queryRandomCode,
  queryToken,
  queryConfirmEmailToken,
  paramId,
  queryResetPasswordToken,
};
module.exports = paramValidator;
