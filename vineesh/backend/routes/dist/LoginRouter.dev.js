"use strict";

var express = require("express");

var jwt = require("jsonwebtoken");

var loginRouter = express.Router();
var users = [{
  id: 1,
  username: "user1",
  password: "password1"
}, {
  id: 2,
  username: "user2",
  password: "password2"
}, {
  id: 3,
  username: "user3",
  password: "password3"
}, {
  id: 4,
  username: "vineesh",
  password: "12vineesh"
}];

function generateToken(userId) {
  var payload = {
    userId: userId
  };
  return jwt.sign(payload, "mysecretkey", {
    expiresIn: "1h"
  });
}

loginRouter.post("/", function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  var user = users.find(function (user) {
    return user.username === username && user.password === password;
  });

  if (user) {
    var token = generateToken(user.id);
    res.status(200).json({
      message: "Successfully logged in",
      token: token
    });
  } else {
    res.status(401).json({
      error: "Invalid credentials"
    });
  }
});
loginRouter.post("/logout", function (req, res) {
  // Invalidate the token or clear it from the session
  // ...
  res.status(200).json({
    message: "Successfully logged out"
  });
});
module.exports = loginRouter;