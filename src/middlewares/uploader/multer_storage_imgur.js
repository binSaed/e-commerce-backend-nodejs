const imgur = require("imgur");
const concat = require("concat-stream");
const sharp = require("sharp");
const { encodeImageToBlurHash } = require("../../utils/image_util");

function setupImgurStorage(opts = {}) {
  if (!opts.clientId) throw new Error("Missing client id");
  imgur.setClientId(opts.clientId);

  async function _handleFile(req, file, cb) {
    if (!file.mimetype || !file.mimetype.match(/image/gi)) {
      return cb(new Error("File is not of image type"));
    }
    const resize = sharp()
      .resize({ width: 500 })
      .jpeg({ quality: 60, palette: true });
    file.stream.pipe(resize).pipe(
      concat((data) => {
        imgur
          ._imgurRequest("upload", data, {})
          .then((json) => {
            const jsonLink = json.link;
            if (!(json && jsonLink)) {
              return cb(new Error("File is not uploaded"));
            }

            const factor = json.width / json.height;

            encodeImageToBlurHash(data, factor)
              .then((imageHash) => {
                cb(null, { ...json, imageHash: imageHash ?? "" });
              })
              .catch(cb);
          })
          .catch(cb);
      })
    );
  }

  function _removeFile() {}

  return { _handleFile, _removeFile };
}

module.exports = function (opts) {
  return setupImgurStorage(opts);
};
