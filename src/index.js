const app = require("./app");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("start listen on port:" + port));

process.on("uncaughtException", (err) => {
  console.error(err.stack); // either logs on console or send to other server via api call.
  fs.appendFileSync(path.join(__dirname, "./../", "access.log"), err.stack);
  // process.exit(1);
});
