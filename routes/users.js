var express = require("express");
var router = express.Router();
const userController = require("../controllers/User");
const checkAuth = require("../middleware/check-auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// router.get("/users/:id", userController.getUser);
///by query params

////by variable
// router.get("/users/usingname/:name", userController.getUser);
router.post("/api/users", userController.saveUser);

router.post("/login/user", userController.loginUser);
router.get("/isuser", userController.getUserByemail);

router.use(checkAuth);

router.get("/users", userController.getUser);
router.post("/userinfo", userController.getUserByid);
router.post("/userupdate", userController.updateUserDetails);
router.post("/resetpass", userController.resetPassword);
module.exports = router;
