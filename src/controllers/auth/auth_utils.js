const User = require("../../models/user");
const Image = require("../../models/image");
const { jwtSign, jwtVerify } = require("../../utils/jwt_promise");
const errorThrower = require("../../utils/error_thrower");

exports.findByEmailOrThrowIfUserExist = async ({ email }) => {
  const user = await User.findOne({ email: email });
  if (user) {
    return errorThrower("Email address already exist!", 422);
  }
  return user;
};
exports.findByEmailOrThrowIfUserNotExist = async ({ email }) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return errorThrower("Email address not exist!", 422);
  }
  return user;
};
exports.findByIdOrThrowIfUserNotExist = async ({ id }) => {
  const user = await User.findById(id);
  if (!user) {
    return errorThrower("User not found!", 400);
  }
  return user;
};
exports.creatCredentialsTO = async ({ to, userID, email }) => {
  const code = random6Digits();
  const token = await jwtSign({ userID, email }, `${code}${to}`);

  return { token, code };
};
exports.verifyTokenTo = async ({ to, code, token }) => {
  const { userID, email } = await jwtVerify(token, `${code}${to}`);
  return { userID, email };
};
exports.getImageById = async ({ id }) => {
  if (id) {
    const image = await Image.findById(id).select("-_id -deletehash");
    if (image) {
      return image;
    }
  }
  return null;
};

const random6Digits = () => Math.floor(100000 + Math.random() * 900000);
