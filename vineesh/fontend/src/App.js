import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import './App.css';
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import BookingScreen from "./screens/BookingScreen";

const stripePromise = loadStripe("pk_test_51MMkh2SJhTOGezu46Ev3QjbA0EXiZcJwVB52bJWoR3DIakHEtcp24AgpxvLEBRPJwNGimgiuPHrSd7v6peNIflQz00Wm27UK3j");

function App() {
	const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [error, setError] = useState(null);
	const [succeeded, setSucceeded] = useState(false);

	const fetchData = async () => {
        setLoading(true);
		try {
            const response = await fetch("http://localhost:5000/api/v1/user/available-slots");
            const actualData = await response.json();
            setData(actualData.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
	};

	useEffect(() => {
		fetchData();
	}, []);

	const filteredData =
		selectedIndex !== null ? data.filter((_, i) => i === selectedIndex) : data;

    if (loading) {
        return <div>Loading...</div>;
    }

	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					<Route path="/" exact={true} element={<HomeScreen data={data} />} />
					<Route
						path="/book_seat/:id"
						element={<BookingScreen data={data} />}
					/>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
