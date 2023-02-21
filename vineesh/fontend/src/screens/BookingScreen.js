import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Checkout from "../components/Checkout";

function BookingScreen({ data, updateData }) {
  const [bookingData, setBookingData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const booking = data.find(x => x._id === id);
    setBookingData(booking);
  }, [data, id]);

  const handleCheckoutSuccess = () => {
    if (bookingData) {
      const updatedData = data.map(d => {
        if (d._id === id) {
          return { ...d, available_seats: d.available_seats - 1 };
        }
        return d;
      });
      updateData(updatedData);
      setBookingData(prevState => ({ ...prevState, available_seats: prevState.available_seats - 1 }));
    }
  };

  return (
    <div>
      {bookingData && (
        <div style={{ display: "flex" }}>
          <img src={bookingData.imageUrl} />
          <div>
            <h4>Available seat</h4>
            <h6>{bookingData.available_seats}</h6>
          </div>
          <br />
          <div>
            <h4>Rate</h4>
            <h6>{bookingData.date}</h6>
          </div>
          <br />
          <div>
            <h4>time</h4>
            <h6>{bookingData.time}</h6>
          </div>
          <br />
          <div>
            <h4>Destination</h4>
            <h6>{bookingData.to}</h6>
          </div>
          <div>
            <Checkout
              name={"Your Company Name"}
              description={"Item that you sold"}
              amount={4.99}
              onCheckoutSuccess={handleCheckoutSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingScreen;



