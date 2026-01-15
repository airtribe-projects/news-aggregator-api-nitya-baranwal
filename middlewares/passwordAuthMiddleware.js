const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

async function passwordAuthMiddleware(req, res, next) {
    try {
        // read the Authorization header safely
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (!authHeader) {
            return res.status(401).send({ message: "Token missing" });
        }

        const parts = authHeader.split(' ');
        const token = parts.length === 2 ? parts[1] : parts[0];
        if (!token) {
            return res.status(401).send({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // token payload from login uses `id`, but accept common variants
        const userId = decoded.id || decoded.userId || decoded._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({ message: "Unauthorized", error: error.message });
    }
}

module.exports = passwordAuthMiddleware;