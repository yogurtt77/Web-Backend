require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");

// Schema for validation
const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

// Register a new user
exports.register = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    console.log("Register attempt:", username);

    // Validate input
    const { error } = userSchema.validate({ username, password });
    if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log("User already exists");
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Debug log

    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: "User created successfully", user: { id: user._id, username: user.username } });
});

// Login user
exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", username);

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        return res.status(500).json({ message: "Server error: JWT_SECRET is missing" });
    }

    // Validate input
    const { error } = userSchema.validate({ username, password });
    if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ username });
    console.log("User found:", user); // Debug log

    if (!user) {
        console.log("User not found");
        return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Stored password hash:", user.password);
    console.log("Password being compared:", password); // Debug log
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debug log

    if (!isMatch) {
        console.log("Incorrect password");
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Login successful, token generated");

    res.json({ token, user: { id: user._id, username: user.username } });
});
// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
    console.error("Error: ", err);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
};