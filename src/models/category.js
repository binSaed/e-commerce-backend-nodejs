const mongoose = require("mongoose");
const { Schema, Types, model } = require("mongoose");
const _ = require("lodash");
const CONSTANT = require("../constants/constant");

const mongooseIntl = require("mongoose-intl");

// r we need to know who creates the category? it depends. HaHaHa
// I need to stop over-engineering and end this project ASAP
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
categorySchema.pre("save", async function (next) {
  const category = this;
  // i used uniqBy instead of uniq
  // because ObjectId("foo") == ObjectId("foo"); => false
  //the solve for this problem is to convert to string
  category.items = _.uniqBy(category.items, (id) => id.toString());
  next();
});
module.exports = mongoose.model("Category", categorySchema);
