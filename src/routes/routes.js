const authRouter = require("./auth");
const categoryRouter = require("./category");
const itemRouter = require("./item");
const errorHandler = require("./helper/error_handler");
const notFound = require("./helper/404");
const logErrors = require("../middlewares/log_errors");
const { Router } = require("express");
const routers = Router();

routers.use("/api/auth", authRouter);
routers.use("/api/category", categoryRouter);
routers.use("/api/items", itemRouter);

if (process.env.NODE_ENV !== "test") {
  //not log error in test environment
  routers.use(logErrors);
}
routers.use(errorHandler);

routers.use(notFound);

module.exports = routers;
