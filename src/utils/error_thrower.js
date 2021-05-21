const errorThrower = (err, statusCode) => {
  if (err) {
    const error = new Error(err.toString());
    error.statusCode = statusCode;
    throw error;
  }
};
module.exports = errorThrower;
