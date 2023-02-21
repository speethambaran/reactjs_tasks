const mongoose = require("mongoose");
const dbUrl = "mongodb+srv://aswins:o6BzREpgyvLbMeOg@cluster0.pad12ee.mongodb.net/?retryWrites=true&w=majority"

mongoose.set("strictQuery", false);

module.exports.connect = () => {
	mongoose.connect(
		dbUrl,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		(err) => {
			if (err) throw err;
			console.log("Database connected successfully...." + dbUrl);
		}
	);
};
