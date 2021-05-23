const { Schema, Types, model } = require("mongoose");
const { jwtSign } = require("../utils/jwt_promise");
const bcrypt = require("bcrypt");
const CONSTANT = require("../constants/constant");
const _ = require("lodash");
const { deleteImageById } = require("../utils/image_util");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },

    userType: {
      type: String,
      enum: {
        values: CONSTANT.USER_TYPE,
        message: `wrong user type try ${CONSTANT.USER_ENUM.USER}`,
      },
      default: CONSTANT.USER_ENUM.USER,
    },
    image: {
      type: Types.ObjectId,
      ref: "Image",
    },
    fcmTokens: {
      //TODO should be [{fcmToken, deviceId}]
      type: [String],
      default: [],
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);
UserSchema.methods.generateJWT = function () {
  // add user ip in token
  return jwtSign({
    payload: {
      _id: this._id.toString(),
      email: this.email,
      userType: this.userType,
    },
  });
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    // Hash the plain text password before saving
    user.password = await bcrypt.hash(user.password, 6);
  }
  if (user.isModified("email")) {
    // set emailVerified if user changes his email
    user.emailVerified = false;
  }
  user.fcmTokens = _.union(user.fcmTokens);
  next();
});
// Delete user Image when user is removed
UserSchema.pre("remove", async function (next) {
  const user = this;
  deleteImageById({ id: user.image });
  next();
});
module.exports = model("User", UserSchema);
