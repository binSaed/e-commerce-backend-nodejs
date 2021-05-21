const errorHandler = require("./routes/helper/error_handler");
const express = require("express");
const routers = require("./routes/routes");

const app = express();
require("./middlewares/middlewares")(app);

app.use(routers);
app.use(errorHandler);

require("./db/mongoose_connect")()
    .then((value) => console.log(value))
    .catch((reason) => console.log(reason));
//connect to DB first then run the app
module.exports = app;
