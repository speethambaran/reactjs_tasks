"use strict";

var express = require("express");

var cors = require("cors");

var userRouter = require("./routes/userRouter");

var app = express();
var port = process.env.PORT || 5000; // Database configuration

var db = require("./config/db");

db.connect(); // Enable CORS

app.use(cors()); // Parse request body as JSON

app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); // Routes configuration

app.use("/api/v1/user", userRouter); // Root route

app.get("/", function (req, res) {
  res.send("Node.js server is running");
}); // Start the server

app.listen(port, function () {
  console.log("Server is running at http://localhost:".concat(port));
});