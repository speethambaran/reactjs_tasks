"use strict";

var express = require('express');

var BusTimings = require('../models/dataModel');

var busTimingsRouter = express.Router();
busTimingsRouter.post('/update-seats', function _callee(req, res) {
  var id, updatedTiming;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.body.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(BusTimings.findOneAndUpdate({
            _id: id
          }, {
            $inc: {
              available_seats: -1
            }
          }));

        case 3:
          updatedTiming = _context.sent;

          if (updatedTiming) {
            res.send({
              status: 'success',
              message: 'Seats updated successfully'
            });
          } else {
            res.send({
              status: 'failure',
              message: 'Could not update seats'
            });
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = busTimingsRouter;