var express = require("express");
// const User = require("../models/User");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("hello this is world!");
});

module.exports = router;
