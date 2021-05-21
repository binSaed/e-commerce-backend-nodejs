const notFound = (__, res) => {
	return res.status(404).jsonFail({
		message: "api not found",
	});
};
module.exports = notFound;
