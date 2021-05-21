module.exports = (app) => {
	app.response.jsonSuccess = function (obj) {
		return this.json({
			status: true,
			...obj,
		});
	};
	app.response.jsonFail = function (obj) {
		return this.json({
			status: false,
			...obj,
		});
	};
}