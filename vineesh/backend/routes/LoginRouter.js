const express = require("express");
const jwt = require("jsonwebtoken");
const loginRouter = express.Router();

const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" },
    { id: 3, username: "user3", password: "password3" },
    { id: 4, username: "vineesh", password: "12vineesh" }
];

function generateToken(userId) {
    const payload = {
        userId: userId
    };
    return jwt.sign(payload, "mysecretkey", { expiresIn: "1h" });
}

loginRouter.post("/", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        user => user.username === username && user.password === password
    );
    if (user) {
        const token = generateToken(user.id);
        res.status(200).json({
            message: "Successfully logged in",
            token: token
        });
    } else {
        res.status(401).json({
            error: "Invalid credentials"
        });
    }
});

loginRouter.post("/logout", (req, res) => {
    // Invalidate the token or clear it from the session
    // ...
    res.status(200).json({ message: "Successfully logged out" });
});

module.exports = loginRouter;
