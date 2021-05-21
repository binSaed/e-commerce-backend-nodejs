const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	// each user only make 100 req in 15 MIN
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 20, // limit each IP to 100 requests per windowMs
	message: {
		status: "error",
		message: "Too many requests, please try again later after 2 minutes.",
	},
});
module.exports = limiter;