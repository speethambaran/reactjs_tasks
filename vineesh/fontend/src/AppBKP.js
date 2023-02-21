import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	useStripe,
	useElements,
	CardElement,
	Elements,
} from "@stripe/react-stripe-js";
import "./App.css";

const stripePromise = loadStripe(
	"pk_test_51MMkh2SJhTOGezu46Ev3QjbA0EXiZcJwVB52bJWoR3DIakHEtcp24AgpxvLEBRPJwNGimgiuPHrSd7v6peNIflQz00Wm27UK3j"
);

function App() {
	const [data, setData] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [error, setError] = useState(null);
	const [succeeded, setSucceeded] = useState(false);
	const stripe = useStripe();
	const elements = useElements();

	const fetchData = () => {
		fetch("http://localhost:5000/api/v1/user/available-slots")
			.then((response) => response.json())
			.then((actualData) => {
				setData(actualData.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleButtonClick = (index) => {
		setSelectedIndex(index);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		const selectedItem = data[selectedIndex];
		const { rate } = selectedItem;

		const result = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardElement),
			billing_details: {
				email: "jane.doe@example.com",
			},
		});

		if (result.error) {
			setError(result.error.message);
		} else {
			setError(null);
			setSucceeded(true);
			await fetch("/api/v1/create-charge", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					payment_method_id: result.paymentMethod.id,
					amount: rate * 100,
				}),
			});
		}
	};

	const filteredData =
		selectedIndex !== null ? data.filter((_, i) => i === selectedIndex) : data;

	return (
		<Elements stripe={stripePromise}>
			<div className="App">
				<form onSubmit={handleSubmit}>
					<table>
						<tbody>
							<tr>
								<th>Time</th>
								<th>Busname</th>
								<th>From</th>
								<th>To</th>
								<th>Available Seats</th>
								<th>Image</th>
								<th>Rate</th>
								<th>Add seat</th>
							</tr>
							{filteredData.map((item, index) => (
								<tr key={index}>
									<td>{item.time}</td>
									<td>{item.bus_name}</td>
									<td>{item.from}</td>
									<td>{item.to}</td>
									<td>{item.available_seats}</td>
									<td>
										<img src={item.imageUrl} alt="" height={100} />
									</td>
									<td>{item.rate}</td>
									<td>
										<button
											type="button"
											class="btn btn-primary"
											onClick={() => handleButtonClick(index)}
										>
											Add seat
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{selectedIndex !== null && (
						<div>
							<h3>Payment form</h3>
							<CardElement />
							<button type="submit" disabled={!stripe}>
								Pay
							</button>
							{error && <p>{error}</p>}
							{succeeded && <p>Payment succeeded</p>}
						</div>
					)}
				</form>
			</div>
		</Elements>
	);
}

export default App;
