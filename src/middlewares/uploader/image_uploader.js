const _multer = require("multer");
const acceptedMimetype = ["image/png", "image/jpeg", "image/jpg"];

const multerStorageImgur = require("./multer_storage_imgur");

const _fileFilter = (req, file, callback) => {
  callback(null, acceptedMimetype.includes(file.mimetype));
};

const upload = _multer({
  storage: multerStorageImgur({ clientId: process.env.IMGUR_CLIENT_ID }),
  fileFilter: _fileFilter,
});

exports.single = upload.single("image");
exports.array = upload.array("image", 4);
