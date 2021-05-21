const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../../models/user");
const Image = require("../../models/image");
const errorThrower = require("../../utils/error_thrower");
const emails = require("../../services/emails/emails");
const CONSTANT = require("../../constants/constant");
const {
  findByEmailOrThrowIfUserExist,
  findByEmailOrThrowIfUserNotExist,
  findByIdOrThrowIfUserNotExist,
  creatCredentialsTO,
  verifyTokenTo,
  getImageById,
} = require("./auth_utils");
const { deleteImageById } = require("../../utils/image_util.js");

exports.login = async (req, res, next) => {
  try {
    const { email, password, fcmToken } = req.body;
    const user = await findByEmailOrThrowIfUserNotExist({ email: email });
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return errorThrower("Email or password incorrect!", 422);
    }
    if (fcmToken) {
      user.fcmTokens.push(fcmToken);
      user.save();
    }
    const token = await user.generateJWT();

    return res.jsonSuccess({
      user: {
        ..._.pick(user, [
          "_id",
          "name",
          "email",
          "phone",
          "emailVerified",
          "userType",
        ]),
        image: await getImageById({ id: user.image }),
      },
      token,
    });
  } catch (e) {
    next(e);
  }
};
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, fcmToken } = req.body;
    await findByEmailOrThrowIfUserExist({ email: email });
    const fcmTokens = fcmToken ? [fcmToken] : [];
    const user = new User({ name, email, phone, password, fcmTokens });
    await user.save();

    const jwtToken = await user.generateJWT();
    const { token, code } = await creatCredentialsTO({
      to: "verifyEmail",
      email: user.email,
      userID: user._id,
    });
    res.jsonSuccess({
      user: {
        ..._.pick(user, ["_id", "name", "email", "phone", "emailVerified"]),
      },
      token: jwtToken,
      confirmEmailToken: token,
    });
    await emails.sendConfirmEmail({
      to: email,
      name,
      ConfirmEmailToken: token,
      code,
    });
  } catch (e) {
    next(e);
  }
};
exports.profile = async (req, res, next) => {
  try {
    const user = await findByIdOrThrowIfUserNotExist({ id: req.userId });
    return res.jsonSuccess({
      user: {
        ..._.pick(user, [
          "_id",
          "name",
          "email",
          "phone",
          "emailVerified",
          "userType",
        ]),
        image: await getImageById({ id: user.image }),
      },
    });
  } catch (e) {
    next(e);
  }
};
exports.refreshFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    const user = await findByIdOrThrowIfUserNotExist({ id: req.userId });

    user.fcmTokens.push(fcmToken);
    user.save();

    return res.jsonSuccess();
  } catch (e) {
    next(e);
  }
};
exports.reSendConfirmEmail = async (req, res, next) => {
  try {
    const user = await findByIdOrThrowIfUserNotExist({ id: req.userId });

    const { token, code } = await creatCredentialsTO({
      to: "verifyEmail",
      email: user.email,
      userID: user._id,
    });
    res.jsonSuccess({
      confirmEmailToken: token,
    });
    await emails.sendConfirmEmail({
      to: user.email,
      name: user.name,
      confirmEmailToken: token,
      code,
    });
  } catch (e) {
    next(e);
  }
};
exports.verifyEmail = async (req, res, next) => {
  try {
    const { code, confirmEmailToken } = req.query;

    const { userID, email } = await verifyTokenTo({
      to: "verifyEmail",
      code: code,
      token: confirmEmailToken,
    });
    const user = await findByEmailOrThrowIfUserNotExist({ email: email });
    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }
    return res.jsonSuccess({
      user: _.pick(user, ["_id", "email", "emailVerified"]),
    });
  } catch (e) {
    next(e);
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findByEmailOrThrowIfUserNotExist({ email: email });
    const { token, code } = await creatCredentialsTO({
      to: "resetPassword",
      email: user.email,
      userID: user._id,
    });
    res.jsonSuccess({
      message: `Email sent to ${user.email}`,
      resetPasswordToken: token,
    });
    await emails.sendResetPassword({
      to: email,
      resetPasswordToken: token,
      code,
    });
  } catch (e) {
    next(e);
  }
};
exports.verifyResetPassword = async (req, res, next) => {
  try {
    const { code, resetPasswordToken } = req.query;

    const { userID, email } = await verifyTokenTo({
      to: "resetPassword",
      code: code,
      token: resetPasswordToken,
    });
    const user = await findByEmailOrThrowIfUserNotExist({ email: email });

    const tokenJWT = await user.generateJWT();
    return res.jsonSuccess({ token: tokenJWT });
  } catch (e) {
    next(e);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    let image;
    const allowedUpdates = ["name", "email", "phone"];
    const updatesReq = Object.keys(req.body); // ["email", "password"];
    const updates = updatesReq.filter((update) =>
      allowedUpdates.includes(update)
    );

    const user = await findByIdOrThrowIfUserNotExist({ id: req.userId });

    const file = req.file;
    if (file) {
      image = new Image({
        ..._.pick(file, ["deletehash", "link", "imageHash"]),
      });
      await image.save();
      req.body.image = image._id;
      if (image) {
        deleteImageById({ id: user.image });
        updates.push("image");
      }
    }

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();
    if (!image) {
      image = await getImageById({ id: user.image });
    }

    return res.jsonSuccess({
      user: {
        ..._.pick(user, ["_id", "name", "email", "phone", "emailVerified"]),
        image: image,
      },
    });
  } catch (e) {
    next(e);
  }
};
