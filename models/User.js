const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    user_id: String,
    name: String,
    email: String,
    password: String,
    picture: String,
    sign_in: String,
    google_password: String,
  })
);

module.exports = User;
