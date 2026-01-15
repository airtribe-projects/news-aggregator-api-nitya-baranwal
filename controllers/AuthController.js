const UserModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function register(req, res) {
    console.log("Inside register controller");
    try {
        const { name, password, email, preferences } = req.body;

        console.log("Register request body:11", req.body);
        if(!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        console.log("Existing user check:16", existingUser);
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            password: hashedPassword,
            email,
            preferences
        });

        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
}

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
}

async function login(req, res) {
    console.log("Inside login controller");
    try {
        const { password, email } = req.body;

        let user;
        if (email) {
            user = await UserModel.findOne({ email });
            if (!user) return res.status(404).json({ message: "User not found" });
        } else {
            return res.status(400).json({ message: 'Missing credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch) {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || 'test-secret',
                { expiresIn: '10m'}
            );

            // 2. Send the token in a cookie (Best practice for security)
            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 10 * 60 * 1000)
            });
            res.header('Authorization', `Bearer ${token}`);

            res.status(200).json({
                message: "Login successful",
                token
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
}

module.exports = { register, login };