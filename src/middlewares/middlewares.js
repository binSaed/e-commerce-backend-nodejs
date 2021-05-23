const express = require("express");
const auth = require("http-auth");
const authConnect = require("http-auth-connect");
const statusMonitor = require("express-status-monitor")({ path: "" });
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const corsHeader = require("../middlewares/cors_header");
const acceptLanguage = require("../middlewares/accept_language");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const limiter = require("../middlewares/requests_limiter");
const requestIp = require("request-ip");

module.exports = (app) => {
  app.set("trust proxy", 1);
  app.use(statusMonitor.middleware);
  app.get(
    "/admin/statusMonitor",
    authConnect(
      auth.basic({}, (user, pass, callback) =>
        //TODO make real auth
        callback(user === "user" && pass === "pass")
      )
    ),
    statusMonitor.pageRoute
  );
  app.use(limiter);
  app.use(compression());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(helmet());
  app.use(requestIp.mw()); //req.clientIp
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: "10kb" }));
  app.use(express.static(path.join(__dirname, "../../", "public")));
  app.use(corsHeader);
  app.use(acceptLanguage);
  require("../utils/json_success_fail")(app);
  if (process.env.NODE_ENV !== "test") {
    //not log error in test environment
    const accessLogStream = fs.createWriteStream(
      path.join(__dirname, "./../../", "access.log")
    );

    app.use(
      morgan(
        ":remote-addr __ :method __ HTTP/:http-version __ :url __ :status __ :res[content-length] __ :req[header] __ :response-time ms __ :date[iso]",
        { stream: accessLogStream }
      )
    );
  }
};
