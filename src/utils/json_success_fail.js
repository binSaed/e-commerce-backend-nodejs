module.exports = (app) => {
  app.response.jsonSuccess = function (obj, statusCode) {
    return this.status(statusCode ?? 200).json({
      status: true,
      ...obj,
    });
  };
  app.response.jsonFail = function (obj, statusCode) {
    return this.status(statusCode ?? 400).json({
      status: false,
      ...obj,
    });
  };
};
