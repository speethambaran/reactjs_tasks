import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { baseurl } from "../constants/applicationconstant";

const CURRENCY = "USD";

const fromDollarToCent = (amount) => parseInt(amount * 100);

function Checkout({ name, description, amount, onCheckoutSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [showCheckout, setShowCheckout] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (response) => {
    alert("Payment Successful");
    onCheckoutSuccess();
  };

  const handlePaymentError = (error) => {
    alert("Payment Error");
  };

  const onToken = (token) =>
    axios
      .post(`${baseurl}/api/v1/user/create-charge`, {
        product: {
          name: formData.name,
          amount: fromDollarToCent(amount),
          quantity: 1,
          payment_method_id:1
        },
      })
      .then(handlePaymentSuccess)
      .catch(handlePaymentError);

  return (
    <div>
      {!showCheckout ? (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      ) : (
        <StripeCheckout
          name={name}
          description={description}
          amount={fromDollarToCent(amount)}
          token={onToken}
          currency={CURRENCY}
          stripeKey={"pk_test_51MMkh2SJhTOGezu46Ev3QjbA0EXiZcJwVB52bJWoR3DIakHEtcp24AgpxvLEBRPJwNGimgiuPHrSd7v6peNIflQz00Wm27UK3j"}
          zipCode
          email={formData.email}
          allowRememberMe
        />
      )}
    </div>
  );
}

export default Checkout;

