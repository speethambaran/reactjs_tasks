const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");

const app = express();
const port = process.env.PORT || 5000;

// Database configuration
const db = require("./config/db");
db.connect();

// Enable CORS
app.use(cors());

// Parse request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes configuration
app.use("/api/v1/user", userRouter);


// Root route
app.get("/", (req, res) => {
	res.send("Node.js server is running");
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
