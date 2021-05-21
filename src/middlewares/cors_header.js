const corsHeader = (req, res, next) => {
	//to accept connect to server from other domain (CORS)
	res.setHeader("Access-Control-Allow-Origin", "*"); //accept all domain
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "*"); //accept all headers

	if (req.method.toString().toLowerCase() === "options") {
		//fix issue with modern browser
		//first browser options request to check server status
		return res.sendStatus(200);
	}

	return next();
};
module.exports = corsHeader;
