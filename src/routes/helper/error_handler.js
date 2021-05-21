const errorHandler = (err, __, res, _) => {
	const {statusCode, message} = err;
	return res.status(statusCode || 500).jsonFail({message});
};
module.exports = errorHandler;
