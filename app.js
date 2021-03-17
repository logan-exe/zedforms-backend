require("dotenv").config();
var express = require("express");
const app = express();
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const sgMail = require("@sendgrid/mail");
// console.log(process.env.SENDGRID_API_KEY);

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
const mongoConnect = require("./util/database");

const mainRoutes = require("./routes/index");
const userRoutes = require("./routes/users");
const formRoutes = require("./routes/Form");
const FormResponse = require("./routes/formResponse");
// var cors = require("cors");
// app.use(cors());

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
// app.use(cors());
app.get("/checkmail", (req, res) => {
  // console.log("this is key", process.env.SENDGRID_API_KEY);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "arun.11143@gmail.com", // Change to your recipient
    from: "arun@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then((data) => {
      console.log("Email sent", data);
    })
    .catch((error) => {
      console.error(error);
    });
  res.send("success");
});
app.use(mainRoutes);
app.use(userRoutes);
app.use(formRoutes);
app.use(FormResponse);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoConnect((res) => {
  console.log("connection successfull");
  app.listen(3001);
});
