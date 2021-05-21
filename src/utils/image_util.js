const Imgur = require("imgur");
const sharp = require("sharp");
const blurHash = require("blurhash");
const Image = require("../models/image");

// factor=width/height
// factor=500/600=0.83
exports.encodeImageToBlurHash = (data, factor = 1) =>
  new Promise((resolve, reject) => {
    sharp(data)
      .raw()
      .ensureAlpha()
      .resize(Math.round(44 * factor), 44, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(
          blurHash.encode(new Uint8ClampedArray(buffer), width, height, 4, 4)
        );
      });
  });
exports.deleteImageById = async ({ id }) => {
  if (id) {
    const image = await Image.findByIdAndDelete(id);
    if (image) {
      Imgur.deleteImage(image.deletehash);
    }
  }
};
