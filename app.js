var express = require("express");
const app = express();
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

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
