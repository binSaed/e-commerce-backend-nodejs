const CONSTANT = require("../constants/constant");
const { Schema, Types, model } = require("mongoose");
const mongooseIntl = require("mongoose-intl");
const itemSchema = new Schema(
  {
    title: {
      type: String,
      intl: true,
      requiredAll: true,
    },
    disc: {
      type: String,
      intl: true,
      requiredAll: true,
    },
    units: [
      //https://www.fakahany.com/ar/item/view/228
      {
        _id: {
          type: Types.ObjectId,
          required: true,
          auto: true,
        },
        name: {
          type: String,
          intl: true,
          requiredAll: true,
        },
        images: {
          type: [
            {
              type: Types.ObjectId,
              ref: "Image",
            },
          ],
          default: [],
          required: false,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: false,
          default: 0,
        },
        maxQuantityInOrder: {
          type: Number,
          // max Quantity user can add to Order
        },
      },
    ],
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
    },
  }
);
itemSchema.plugin(mongooseIntl, {
  languages: CONSTANT.LANGUAGES,
  defaultLanguage: CONSTANT.DEFAULT_LANGUAGE,
});
module.exports = model("Item", itemSchema);
