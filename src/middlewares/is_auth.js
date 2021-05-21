const { jwtVerify } = require("../utils/jwt_promise");
const errorThrower = require("../utils/error_thrower");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    errorThrower("Not authenticated", 401);
  }
  const token = authHeader.replace("Bearer ", "");

  try {
    const decodeToken = await jwtVerify(token);

    req.userId = decodeToken._id;
    req.userEmail = decodeToken.email;
    req.userType = decodeToken.userType;
    next();
  } catch (e) {
    next(e);
  }
};
