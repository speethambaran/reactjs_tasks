"use strict";

var express = require("express");

var BusTimings = require("../models/dataModel");

var stripe = require("stripe")("sk_test_51MMkh2SJhTOGezu4nSuzWaBlkYpkGNA9QnsfKBxYOYp7kaTHewlgj2BNaog6Ltgtch4lkjadRAH1q0jPcwL8r4iS00P2y0ap92");

var userRouter = express.Router();
var YOUR_DOMAIN = "http://localhost:3000";
userRouter.get("/available-slots", function _callee(req, res) {
  var slots, response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(BusTimings.find());

        case 3:
          slots = _context.sent;
          response = {};

          if (slots.length > 0) {
            response.code = 200;
            response.status = "success";
            response.data = slots;
          } else {
            response.code = 200;
            response.status = "success";
            response.data = "No slots available";
          }

          res.send(response);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.status(500).send({
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
userRouter.post("/create-checkout-session", function _callee2(req, res) {
  var _req$body, name, amount, slot, session;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, name = _req$body.name, amount = _req$body.amount, slot = _req$body.slot;
          _context2.next = 4;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
              price_data: {
                currency: "usd",
                product_data: {
                  name: name
                },
                unit_amount: amount
              },
              quantity: 1
            }],
            mode: "payment",
            success_url: "".concat(YOUR_DOMAIN, "/success.html"),
            cancel_url: "".concat(YOUR_DOMAIN, "/cancel.html"),
            metadata: {
              slot_id: slot._id.toString()
            }
          }));

        case 4:
          session = _context2.sent;
          res.json({
            id: session.id
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).send({
            error: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
userRouter.post("/create-charge", function _callee3(req, res) {
  var _req$body2, payment_method_id, amount, slot_id, charge;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log('data from frontend : ', req.body);
          _req$body2 = req.body, payment_method_id = _req$body2.payment_method_id, amount = _req$body2.amount, slot_id = _req$body2.slot_id; // Create a charge using the payment method and amount

          _context3.next = 5;
          return regeneratorRuntime.awrap(stripe.charges.create({
            payment_method: payment_method_id,
            amount: amount,
            currency: "usd",
            confirmation_method: "manual",
            confirm: true
          }));

        case 5:
          charge = _context3.sent;
          console.log(charge ? charge : console.log('no charge')); // Update the available seat count in the database
          // const updatedSlot = await BusTimings.findOneAndUpdate(
          //   { _id: slot_id },
          //   { $inc: { availableSeats: -1 } },
          //   { new: true }
          // );
          // // If the slot is not found, return a 404 error
          // if (!updatedSlot) {
          //   return res.status(404).send({ error: "Slot not found" });
          // }
          // // If the slot is found but there are no available seats, return an error
          // if (updatedSlot.availableSeats < 0) {
          //   return res.status(400).send({ error: "No available seats for this slot" });
          // }
          // Send the response back to the client

          res.send({
            status: "success",
            charge: charge // updatedSlot: updatedSlot,

          });
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.log('error : ', _context3.t0); // Send the error message back to the client

          res.send({
            status: "failure",
            error: _context3.t0.message
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = userRouter;