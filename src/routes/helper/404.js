const notFound = (__, res) => {
  return res.jsonFail(
    {
      message: "api not found",
    },
    404
  );
};
module.exports = notFound;
