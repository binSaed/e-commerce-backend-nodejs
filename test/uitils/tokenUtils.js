const { jwtSign } = require("../../src/utils/jwt_promise");

let _expiredUserToken;
let _expiredOwnerToken;
let _userToken;
let _wrongUserToken;
let _ownerUserToken;

exports.expiredUserToken = async () => {
  if (_expiredUserToken) return _expiredUserToken;

  _expiredUserToken = await jwtSign({
    payload: {
      _id: "id",
      email: "me@abdosaed.ml",
      userType: "user",
    },
    expiresIn: "0",
  });
  return _expiredUserToken;
};
exports.expiredOwnerToken = async () => {
  if (_expiredOwnerToken) return _expiredOwnerToken;

  _expiredOwnerToken = await jwtSign({
    payload: {
      _id: "id",
      email: "me@abdosaed.ml",
      userType: "owner",
    },
    expiresIn: "0",
  });
  return _expiredOwnerToken;
};
exports.userToken = async () => {
  if (_userToken) return _userToken;

  _userToken = await jwtSign({
    payload: {
      _id: "id",
      email: "me@abdosaed.ml",
      userType: "user",
    },
  });
  return _userToken;
};
exports.wrongUserToken = async () => {
  if (_wrongUserToken) return _wrongUserToken;

  const token = await jwtSign({
    payload: {
      _id: "id",
      email: "me@abdosaed.ml",
      userType: "user",
    },
  });
  _wrongUserToken = token.replace("a", "b"); //to be wrong token
  return _wrongUserToken;
};
exports.ownerUserToken = async () => {
  if (_ownerUserToken) return _ownerUserToken;

  _ownerUserToken = await jwtSign({
    payload: {
      _id: "id",
      email: "me@abdosaed.ml",
      userType: "owner",
    },
  });

  return _ownerUserToken;
};
