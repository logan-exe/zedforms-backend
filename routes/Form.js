var express = require("express");
// const User = require("../models/User");
var router = express.Router();
const checkAuth = require("../middleware/check-auth");
const fromController = require("../controllers/Form");
// router.use(checkAuth);
router.post("/form/:myid", fromController.saveForm);
router.get("/form/:myid", fromController.getForm);
module.exports = router;
