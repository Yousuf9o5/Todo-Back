const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const response = require("./src/utils/util");
const { todoRouter } = require("./src/routers/todoItemRouter");
const { AuthRouter } = require("./src/routers/AuthRouter");
require("dotenv").config();

/* ########### Mongodb ########### */
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/todo-app");
const db = mongoose.connection;
db.on("error", (e) => {
  console.log("not connected: ", e);
});
db.once("open", () => {
  console.log("connected to db");
});

/* ########### App uses ########### */
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", AuthRouter);
app.use("/todo", todoRouter);

app.get("/", (req, res) => {
  res.status(200).json(response(200, "Server is running", null));
});

app.listen(3000);
