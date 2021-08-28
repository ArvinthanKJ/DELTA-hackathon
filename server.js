var express = require("express");
var cors = require("cors");
app = express();
app.use(cors({}));
app.use(express.json());

var Auth = require("./controllers/auth");
var Presentation = require("./controllers/presentation");
app.set("view engine", "ejs");
//app.engine('ejs', require('ejs').__express);
Auth(app);
Presentation(app);
app.use(express.static(__dirname + "/public"));

app.listen(3020, "127.0.0.1");
console.log("reading");
