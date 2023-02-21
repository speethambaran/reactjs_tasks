const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
	{
		time: { type: String, required: true },
		bus_name: { type: String, required: true },
		from: { type: String, required: true },
		to: { type: String, required: true },
		available_seats: { type: String, required: true },
		rate: { type: String },
	},
	{ timestamps: true }
);

const BusTimings = mongoose.model("BusTimings", bookingSchema);
module.exports = BusTimings;
