const mongoose = require("mongoose");
// const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  mongoose
    .connect(
      process.env.MONGODB_URL ||
        "mongodb+srv://arunlogan:3PXWuue9ftkiw0Zh@zedforms.gwirj.mongodb.net/Users?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    )
    .then((res) => {
      console.log("connected");
      callback(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;