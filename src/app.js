const errorHandler = require("./routes/helper/error_handler");
const express = require("express");
const routers = require("./routes/routes");

const app = express();
require("./middlewares/middlewares")(app);
app.get("/", (req, res) => {
  return res.jsonSuccess({ urIp: req.clientIp });
  // const Item = require("../../models/item");
  // const item = new Item({
  //   title: { en: "title", ar: "title1" },
  //   disc: { en: "disc", ar: "disc1" },
  //   units: [
  //     {
  //       name: { en: "name", ar: "name1" },
  //       price: 33,
  //       discount: 9,
  //     },
  //     {
  //       name: { en: "name", ar: "name1" },
  //       price: 33,
  //       discount: 9,
  //     },
  //   ],
  // });
  //
  // await item.save();
  // console.log(item.toJSON());
  // }
});

app.use(routers);
app.use(errorHandler);

require("./db/mongoose_connect")()
  .then((value) => console.log(value))
  .catch((reason) => console.log(reason));
//connect to DB first then run the app
module.exports = app;
