const isAuth = require("../middlewares/is_auth");
const errorThrower = require("../utils/error_thrower");
const constant = require("../constants/constant");
const { jwtVerify } = require("../utils/jwt_promise");
module.exports = (action) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.get("Authorization");

      if (!authHeader) {
        errorThrower("Not authenticated", 401);
      }
      const token = authHeader.replace("Bearer ", "");
      const decodeToken = await jwtVerify(token);

      const userType = decodeToken.userType;

      if (constant.PERMISSIONS[action].includes(userType)) {
        next();
      } else {
        return errorThrower(
          "Token valid, but you don't have the right permission:)",
          403
        );
      }
    } catch (error) {
      next(error);
    }
  };
};
