"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var bodyParser = require("body-parser");

var stripe = require("stripe")("your_stripe_secret_key");

var app = express();
app.use(bodyParser.json());
var data = [{
  _id: "1",
  available_seats: 10,
  date: "2022-12-25",
  time: "10:00",
  to: "New York",
  imageUrl: "https://via.placeholder.com/150"
}, {
  _id: "2",
  available_seats: 5,
  date: "2022-12-25",
  time: "12:00",
  to: "London",
  imageUrl: "https://via.placeholder.com/150"
}];
app.post("/checkout", function _callee(req, res) {
  var id, bookingData, amount, paymentIntent, updatedData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.body.id;
          bookingData = data.find(function (x) {
            return x._id === id;
          });

          if (bookingData) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Booking not found"
          }));

        case 4:
          amount = 4.99 * 100;
          _context.next = 7;
          return regeneratorRuntime.awrap(stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            description: "Item that you sold",
            payment_method: req.body.payment_method_id,
            confirmation_method: "manual",
            confirm: true
          }));

        case 7:
          paymentIntent = _context.sent;

          if (!(paymentIntent.status === "succeeded")) {
            _context.next = 14;
            break;
          }

          updatedData = data.map(function (d) {
            if (d._id === id) {
              return _objectSpread({}, d, {
                available_seats: d.available_seats - 1
              });
            }

            return d;
          });
          data = updatedData;
          return _context.abrupt("return", res.json({
            message: "Payment succeeded"
          }));

        case 14:
          return _context.abrupt("return", res.status(400).json({
            message: "Payment failed"
          }));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.listen(3000, function () {
  return console.log("Server running on port 3000");
});