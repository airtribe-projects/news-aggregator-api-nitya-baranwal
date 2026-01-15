const express = require('express');
const { HomePageResponse, AboutPageResponse, getPreferences, updatePreferences } = require('../controllers/HomeController');
const passwordAuthMiddleware = require('../middlewares/passwordAuthMiddleware');
const router = express.Router();

router.get('/', HomePageResponse);
router.get('/home', HomePageResponse);
router.get('/about', AboutPageResponse);

// Preferences endpoints used by tests mounted under /users
router.get('/preferences', passwordAuthMiddleware, getPreferences);
router.put('/preferences', passwordAuthMiddleware, updatePreferences);

module.exports = router;