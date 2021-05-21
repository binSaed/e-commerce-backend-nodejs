const mongoose = require("mongoose");

module.exports = () => {
  return new Promise((resolutionFunc, rejectionFunc) => {
    const mongooseOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      autoIndex: true,
      keepAlive: true,
      poolSize: 50, //50 people can connect at the same time
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
    mongoose
      .connect(process.env.MONGO_URL, mongooseOptions)
      .then((_) =>
        resolutionFunc("mongo connected to " + process.env.MONGO_URL)
      )
      .catch((error) => rejectionFunc("mongo not connected", error));
  });
};
