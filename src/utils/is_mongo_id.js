const ObjectId = require("mongoose").Types.ObjectId;
const isMongoID = (id) =>
  ObjectId.isValid(id) && new ObjectId(id).toString() === id;
module.exports = isMongoID;
