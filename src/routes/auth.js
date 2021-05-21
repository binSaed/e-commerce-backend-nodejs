const { Router } = require("express");
const router = Router();
const {
  register,
  login,
  resetPassword,
  verifyResetPassword,
  verifyEmail,
  profile,
  updateProfile,
  reSendConfirmEmail,
  refreshFcmToken,
} = require("../controllers/auth/auth");
const uploader = require("../middlewares/uploader/image_uploader");
const isAuth = require("../middlewares/is_auth");
const paramValidator = require("../middlewares/param_validator");
const paramValidation = require("../utils/param_validation");

router.post(
  "/register",
  [
    paramValidator.bodyName,
    paramValidator.bodyEmail,
    paramValidator.bodyPhone,
    paramValidator.bodyPassword,
  ],
  paramValidation,
  register
);
router.post(
  "/login",
  [paramValidator.bodyEmail, paramValidator.bodyPassword],
  paramValidation,
  login
);

router.put("/updateProfile", isAuth, uploader.single, updateProfile);
router.post("/profile", isAuth, profile);
router.post("/reSendConfirmEmail", isAuth, reSendConfirmEmail);
router.get(
  "/verifyEmail",
  [paramValidator.queryRandomCode, paramValidator.queryConfirmEmailToken],
  paramValidation,
  verifyEmail
);
router.post(
  "/resetPassword",
  [paramValidator.bodyEmail],
  paramValidation,
  resetPassword
);
router.get(
  "/verifyResetPassword",
  [paramValidator.queryRandomCode, paramValidator.queryResetPasswordToken],
  paramValidation,
  verifyResetPassword
);
router.post(
  "/refreshFcmToken",
  isAuth,
  [paramValidator.bodyFcmToken],
  paramValidation,
  refreshFcmToken
);

module.exports = router;
