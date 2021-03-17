const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error.js");
var uniqid = require("uniqid");

exports.saveUser = async (req, res) => {
  // console.log(req.body);
  let hashedPassword;

  try {
    if (req.body.sign_in === "Google") {
      hashedPassword = await bcrypt.hash(req.body.google_password, 12);
    } else {
      hashedPassword = await bcrypt.hash(req.body.password, 12);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not create user, please try again later",
      500
    );
    return next(error);
  }
  let newUser;
  if (req.body.sign_in === "Google") {
    newUser = {
      user_id: uniqid("", req.body.name.split(" ")[0]),
      name: req.body.name,
      email: req.body.email,
      password: "",
      picture: req.body.picture,
      google_password: hashedPassword,
      sign_in: req.body.sign_in,
    };
  }
  if (req.body.sign_in === "Manual") {
    newUser = {
      user_id: uniqid("", req.body.name.split(" ")[0]),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      picture: req.body.picture,
      google_password: "",
      sign_in: req.body.sign_in,
    };
  }

  console.log("new_user", newUser);

  // res.send(newUser);

  const createdUser = new User(newUser);
  const savedUser = await createdUser.save();
  let token;
  try {
    token = jwt.sign(
      { userId: savedUser.user_id, email: savedUser.email },
      "supersecret_dont_share",
      { expiresIn: "3h" }
    );
  } catch (err) {
    const error = new HttpError("some error occured", 500);
    return next(error);
  }

  res.status(201).json({
    userId: savedUser.user_id,
    email: savedUser.email,
    picture: savedUser.picture,
    token: token,
  });
};

exports.loginUser = async (req, res, next) => {
  // if (req.body.password === "") {
  //   const error = new HttpError("Does not exists", 500);
  //   return next(error);
  // }
  const user = await User.find({ email: `${req.body.email}` });
  // console.log(user);
  if (user.length === 0) {
    const error = new HttpError("Does not exists", 500);
    return next(error);
  }
  let validPassword = false;
  if (req.body.sign_in === "Google") {
    if (req.body.google_password === "") {
      const error = new HttpError("Does not exists", 500);
      return next(error);
    }
    try {
      if (user[0].google_password === "") {
        let hashedPassword;
        hashedPassword = await bcrypt.hash(req.body.google_password, 12);
        // user[0].google_password = hashedPassword;
        //write query/
        User.findOneAndUpdate(
          { email: req.body.email },
          {
            $set: {
              google_password: hashedPassword,
            },
          },
          { new: true, useFindAndModify: false }
        )
          .then((docs) => {
            console.log(docs);
            // res.send("success");
          })
          .catch((err) => {
            const error = new HttpError(
              "Update failed, please enter valid credentials",
              500
            );
          });

        validPassword = true;
      } else {
        validPassword = await bcrypt.compare(
          req.body.google_password,
          user[0].google_password
        );
      }
    } catch (err) {
      const error = new HttpError(
        "Password did not match, please enter valid password",
        500
      );
      return next(error);
    }
    if (!validPassword) {
      const error = new HttpError(
        "Password did not match, please enter valid password",
        500
      );
      return next(error);
    }
  }
  if (req.body.sign_in === "Manual") {
    if (req.body.password === "") {
      const error = new HttpError("Does not exists", 500);
      return next(error);
    }
    try {
      validPassword = await bcrypt.compare(req.body.password, user[0].password);
    } catch (err) {
      const error = new HttpError(
        "Password did not match, please enter valid password",
        500
      );
      return next(error);
    }
    if (!validPassword) {
      const error = new HttpError(
        "Password did not match, please enter valid password",
        500
      );
      return next(error);
    }
  }

  let token;
  try {
    token = jwt.sign(
     /////write logic for token creation
    );
  } catch (err) {
    const error = new HttpError(
      "Login failed, please enter valid credentials",
      500
    );
  }

  res.send({
    userId: user[0].user_id,
    email: user[0].email,
    picture: user[0].picture,
    name: user[0].name,
    token: token,
  });
};

exports.getUser = async (req, res) => {
  // const user = await User.find(req.query);
  // res.send(user);
  console.log("this is request", req.userData);
  res.send("success");
};

exports.getUserByid = async (req, res) => {
  const user = await User.find({ user_id: req.body.user_id });
  if (user.length !== 0) {
    res.send({
      name: user[0].name,
      email: user[0].email,
      picture: user[0].picture,
      sign_in: user[0].sign_in,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const user = await User.find({ user_id: req.body.user_id });
  if (user[0].sign_in === "Google") {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(req.body.password, 12);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Could not create user, please try again later",
        500
      );
      return next(error);
    }
    User.findOneAndUpdate(
      { user_id: req.body.user_id },
      {
        $set: {
          password: hashedPassword,
          sign_in: "Manual",
        },
      },
      { new: true }
    )
      .then((docs) => {
        console.log(docs);
        res.send("success");
      })
      .catch((err) => {
        const error = new HttpError(
          "Update failed, please enter valid credentials",
          500
        );
      });
  } else {
    let validPassword = false;
    try {
      validPassword = await bcrypt.compare(req.body.oldPass, user[0].password);
    } catch (err) {
      const error = new HttpError(
        "Password did not match, please enter valid password",
        500
      );
      return next(error);
    }
    if (!validPassword) {
      const error = new HttpError(
        "Password did not match, please enter valid password",
        500
      );
      return next(error);
    } else {
      User.findOneAndUpdate(
        { user_id: req.body.user_id },
        {
          $set: {
            password: hashedPassword,
            sign_in: "Manual",
          },
        },
        { new: true }
      )
        .then((docs) => {
          console.log(docs);
          res.send("success");
        })
        .catch((err) => {
          const error = new HttpError(
            "Update failed, please enter valid credentials",
            500
          );
        });
    }
  }
};

exports.getUserByemail = async (req, res) => {
  // console.log(req.query);
  const user = await User.find(req.query);
  // console.log("he is ", user);
  if (user.length !== 0) {
    res.send("success");
  } else {
    res.send("failed");
  }
};

exports.updateUserDetails = async (req, res, next) => {
  console.log(req.body);
  User.findOneAndUpdate(
    { user_id: req.body.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        picture: req.body.picture,
      },
    },
    { new: true }
  )
    .then((docs) => {
      console.log(docs);
      res.send(docs);
    })
    .catch((err) => {
      const error = new HttpError(
        "Update failed, please enter valid credentials",
        500
      );
    });
};
