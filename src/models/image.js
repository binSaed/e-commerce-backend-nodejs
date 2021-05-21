const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const imageSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
      index: true,
    },
    deletehash: {
      type: String,
      required: true,
    },
    imageHash: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: false,
  }
);
module.exports = mongoose.model("Image", imageSchema);
