const mongoose = require("mongoose");
const { Schema, Types, model } = require("mongoose");

const CONSTANT = require("../constants/constant");

const mongooseIntl = require("mongoose-intl");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      intl: true,
      required: true,
      requiredAll: true,
      trim: true,
      unique: true,
    },
    image: {
      type: Types.ObjectId,
      ref: "Image",
      default: null,
      required: false,
    },
    items: {
      type: [
        {
          type: Types.ObjectId,
          ref: "Item",
        },
      ],
      default: [],
      required: false,
    },
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
    },
  }
);
categorySchema.plugin(mongooseIntl, {
  languages: CONSTANT.LANGUAGES,
  defaultLanguage: CONSTANT.DEFAULT_LANGUAGE,
});
module.exports = mongoose.model("Category", categorySchema);
