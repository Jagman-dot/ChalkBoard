var express = require("express"),
app = express(),
bodyparser = require("body-parser"),
mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/commuters", {useNewUrlParser: true});

app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var schema = new mongoose.Schema({
  route : String,
  origin : String,
  destination : String,
  estimatedTimeOfArrival : String,
  date : String,
  time : String
}) 
var detailsModel = mongoose.model("detailsModel", schema);
app.get("/", function (req, res) {
res.render("index",{ details: null })
})
app.get("/getdetails", function (req, res) {   
detailsModel.find({}, function (err, allDetails) {
    if (err) {
        console.log(err);
    } else {
        res.render("index", { details: allDetails })
    }
})
})
app.listen(3000, "localhost", function () {
console.log("server has started");
})