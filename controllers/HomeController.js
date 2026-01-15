const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

function HomePageResponse(req, res) {
    console.log("Inside home controller");

    const token = (req.cookies && req.cookies.token) || req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET || 'test-secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        res.status(200).send('Hello, welcome to the Home Page!');
    });
}

function AboutPageResponse(req, res) {
    res.send('This is the About Page. Here is some information about us.');
}

// Preferences endpoints used by tests
async function getPreferences(req, res) {
    try {
        const user = req.user;
        console.log("Get Preferences for user:16", user.preferences);
        // if middleware attached a full user object, use it; otherwise lookup by id
        let fullUser = user;
        if (user && user.id && !user.preferences) {
            fullUser = await UserModel.findById(user.id);
        }
        if (!fullUser) return res.status(401).json({ message: 'Unauthorized' });
        res.status(200).json({ preferences: fullUser.preferences || [] });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err.message });
    }
}

async function updatePreferences(req, res) {
    try {
        const user = req.user;
        const prefs = req.body.preferences || [];
        let fullUser = user;
        if (user && user.id && !user.preferences) {
            fullUser = await UserModel.findById(user.id);
        }
        if (!fullUser) return res.status(401).json({ message: 'Unauthorized' });
        fullUser.preferences = prefs;
        if (typeof fullUser.save === 'function') await fullUser.save();
        res.status(200).json({ message: 'Preferences updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err.message });
    }
}

module.exports = { HomePageResponse, AboutPageResponse, getPreferences, updatePreferences };