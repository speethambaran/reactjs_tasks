const express = require("express");
const BusTimings = require("../models/dataModel");
const stripe = require("stripe")("sk_test_51MMkh2SJhTOGezu4nSuzWaBlkYpkGNA9QnsfKBxYOYp7kaTHewlgj2BNaog6Ltgtch4lkjadRAH1q0jPcwL8r4iS00P2y0ap92");
const userRouter = express.Router();
const YOUR_DOMAIN = "http://localhost:3000";

userRouter.get("/available-slots", async (req, res) => {
  try {
    const slots = await BusTimings.find();
    const response = {};
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
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/create-checkout-session", async (req, res) => {
  try {
    const { name, amount, slot } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      metadata: {
        slot_id: slot._id.toString(),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/create-charge", async (req, res) => {
  try {
    console.log('data from frontend : ', req.body)
    const { payment_method_id, amount, slot_id } = req.body;

    // Create a charge using the payment method and amount
    const charge = await stripe.charges.create({
      payment_method: payment_method_id,
      amount: amount,
      currency: "usd",
      confirmation_method: "manual",
      confirm: true,
    })
    console.log(charge ? charge : console.log('no charge'))
    // Update the available seat count in the database
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
      charge: charge,
      // updatedSlot: updatedSlot,
    });
  } catch (error) {
    console.log('error : ', error)
    // Send the error message back to the client
    res.send({
      status: "failure",
      error: error.message,
    });
  }
});

module.exports = userRouter;

