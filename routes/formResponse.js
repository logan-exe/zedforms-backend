var express = require("express");
// const User = require("../models/User");
var router = express.Router();

const formResponseController = require("../controllers/FormResponse");

router.post("/formresponse", formResponseController.saveFormResponse);
module.exports = router;
