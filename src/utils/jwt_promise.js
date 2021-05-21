const jwt = require("jsonwebtoken");
exports.jwtSign = (payload = {}, additionalSecret = "") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      `${process.env.PRIVATE_SERVER_KEY}${additionalSecret}`,
      { expiresIn: "30 days" },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};
exports.jwtVerify = (token, additionalSecret = "") => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      `${process.env.PRIVATE_SERVER_KEY}${additionalSecret}`,
      {},
      (err, decodeToken) => {
        if (err || !decodeToken) {
          const error = new Error("Not authenticated");
          error.statusCode = 401;
          return reject(error);
        }
        resolve(decodeToken);
      }
    );
  });
};
