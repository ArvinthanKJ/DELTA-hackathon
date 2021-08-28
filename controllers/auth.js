const { json } = require("body-parser");
const bodyParser = require("body-parser");
let ejs = require("ejs");
const express = require("express");
const bcrypt = require("bcrypt");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

module.exports = function (app) {
  //userID
  app.use(express.urlencoded({ extended: false }));
  //Database MongoDB

  const mongoose = require("mongoose");
  const Members = require("../models/members");
  mongoose.connect("mongodb://localhost/hackathon", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection
    .once("open", function () {
      console.log("Connection has been made with the databse");
    })
    .on("error", function (error) {
      console.log("Connection error:", error);
    });
  var userID;
  var tempRegister;

  app.get("/", (req, res) => {
    res.render("error.ejs");
  });

  app.get("/login", (req, res) => {
    res.render("login.ejs");
  });

  app.post("/login", async (req, res) => {
    var email1 = req.body.email;
    await Members.findOne({ email: email1 }, (err, docs) => {
      if (docs == null) {
        console.log("failure");

        res.redirect("/error");
      } else {
        bcrypt.compare(
          req.body.password,
          docs.password,
          async (err, response) => {
            if (response == true) {
              console.log("Sucess");
              userID = docs._id;
              // DONT FORGET TO PASS ID TO WIEW AND STORE IT IN LOCALSTORAGE
              res.redirect("/dashboard?data=" + userID);
            } else {
              console.log("failure");
              res.redirect("/error");
            }
          }
        );
      }
    });
  });
  app.get("/error", (req, res) => {
    res.render("error.ejs");
  });
  app.get("/register", (req, res) => {
    console.log(userID);

    res.render("register.ejs");
  });

  app.post("/register", async (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      tempRegister = await new Members({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      tempRegister.save();
    });

    res.redirect("/login");
  });
};
