var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");
const adminRouter = require("./routes/admin");
const session = require("express-session");
const flash = require("connect-flash");

var app = express();
require("./configs/db");
require("./models/Peserta");
require("./models/Pendamping");
require("./models/Users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "Hut 50",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/qrcode",
  express.static(path.join(__dirname, "node_modules/html5-qrcode"))
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/pageadm", adminRouter);

app.use("/api/v1", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
