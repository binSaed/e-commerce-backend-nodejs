const logErrors = (err, req, res, next) => {
  console.error("Logger => " + err.stack);
  return next(err);
};
module.exports = logErrors;
