const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("start listen on port:" + port));

//TODO add translation to error all message
