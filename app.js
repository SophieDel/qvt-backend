var express = require("express");
require("dotenv").config();
require("./models/connection");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var messagesRouter = require("./routes/messages");
var articlesRouter = require("./routes/articles");
var questionnaireRouter = require("./routes/questionnaire");
var app = express();

const cors = require("cors");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);
app.use("/articles", articlesRouter);
app.use("/questionnaire", questionnaireRouter);

module.exports = app;

// commentaire guillemette
//commentaire fred
