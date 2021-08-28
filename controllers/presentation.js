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
  app.use(express.urlencoded({ extended: false }));
  //Database MongoDB

  const mongoose = require("mongoose");
  const Members = require("../models/members");
  const Presentations = require("../models/presentations");
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
  var tempPresent;
  var presentationID;
  var flag;
  var slidest;
  var tempArray1;
  app.get("/", (req, res) => {
    res.render("error.ejs");
  });

  app.get("/dashboard", async (req, res) => {
    flag = 1;
    if (req.query.data != null) userID = req.query.data;
    await Members.findOne({ _id: userID }, async (err, docs) => {
      if (docs == null) res.redirect("/error");
      console.log(docs.presentation);
      var k = Array.from(docs.presentation);
      res.render("dashboard.ejs", { palette: k });
    });
  });
  app.get("/createpresentation", (req, res) => {
    res.render("createpresentation.ejs");
  });
  app.post("/createpresentation", async (req, res) => {
    var iid;
    var iname;
    console.log("+++++++++++++++++++");
    console.log(req.body);
    var x = [];
    var y = [];
    var txtbox = [];
    var a = [{ x: x, y: y, txtbox: txtbox }];
    tempPresent = await new Presentations({
      name: req.body.present,
      user: userID,
      slides: a,
    });
    tempPresent.save(async (err, data) => {
      console.log("------------ ");
      console.log(data.id);

      iid = data.id;
      iname = data.name;
      var dummy1 = { id2: iid, name: iname };
      await Members.updateOne(
        { _id: userID },
        { $push: { presentation: dummy1 } }
      );
      res.redirect("/dashboard");
    });
  });

  app.post("/dashboard", async (req, res) => {
    console.log(req.body.but);
    presentationID = req.body.but;
    console.log(presentationID);

    res.redirect("/slides");
  });

  app.get("/slides", async (req, res) => {
    await Presentations.findOne({ _id: presentationID }, async (err, docs) => {
      console.log(docs);
      res.render("slides.ejs", { slides: docs.slides, flag: flag });
    });
  });

  app.get("/addslide", async (req, res) => {
    console.log("=============================");
    flag = flag + 1;
    await Presentations.findOne({ _id: presentationID }, async (err, docs) => {
      if (flag >= docs.slides.length) {
        var x = [];
        var y = [];
        var txtbox = [];
        var a = [{ x: x, y: y, txtbox: txtbox }];
        await Presentations.updateOne(
          { _id: presentationID },
          { $push: { slides: a } }
        );
      }
      res.redirect("/slides");
    });
  });
  app.post("/slides", async (req, res) => {
    console.log(req.body.txt);
    var temp;
    console.log(presentationID);
    await Presentations.findOne({ _id: presentationID }, async (err, docs) => {
      temp = docs.slides;
      temp[flag - 1].x.push(30);
      temp[flag - 1].y.push(30);
      temp[flag - 1].txtbox.push(req.body.txt);
      console.log(temp);
      await Presentations.updateOne(
        { _id: presentationID },
        { $set: { slides: temp } }
      );
      res.redirect("back");
    });
  });
  app.post("/savetxt", async (req, res) => {
    console.log("88888888888888888");

    console.log(req.body);
    var dataa = req.body;
    //var tempArr = JSON.parse(req.body.dataa);
    //console.log(tempArr);
    await Presentations.findOne({ _id: presentationID }, async (err, docs) => {
      console.log("88888888888888888");
      tempArray1 = [];
      var txtboxdummy = [];
      var xdummy = [];
      var ydummy = [];
      await dataa.forEach((element) => {
        txtboxdummy.push(element.text);
        xdummy.push(element.x);
        ydummy.push(element.y);
      });
      tempArray1 = { txtbox: txtboxdummy, x: xdummy, y: ydummy };
      slidest = docs.slides;
      slidest[flag - 1].txtbox = txtboxdummy;
      slidest[flag - 1].x = xdummy;
      slidest[flag - 1].y = ydummy;

      console.log("----------");

      console.log(tempArray1);
    });
    console.log("?//////////////////");
    console.log(tempArray1);
    for (var i = 0; i <= 100000; i++) {}
    console.log(slidest);
    var stringg = `slides[${flag}]`;
    await Presentations.updateOne(
      { _id: presentationID },
      { $set: { slides: slidest } }
    );

    res.redirect("/dashboard");
  });
  app.post("/dupslide", async (req, res) => {
    console.log(req.body.flag);
    await Presentations.findOne({ _id: presentationID }, async (err, docs) => {
      var temparray2 = {
        txtbox: docs.slides[flag].txtbox,
        x: docs.slides[flag].x,
        y: docs.slides[flag].y,
      };
      console.log("1111111111111111");
      console.log(tempPresent);
      await Presentations.updateOne(
        { _id: presentationID },
        { $push: { slides: temparray2 } }
      );
    });
  });
};
