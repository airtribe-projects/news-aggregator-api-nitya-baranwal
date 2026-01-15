require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const HomeRoute = require('./routes/HomeRoute');
const AuthRoute = require('./routes/AuthRoute');
const NewsRoute = require('./routes/NewsRoute');
const passwordAuthMiddleware = require('./middlewares/passwordAuthMiddleware');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Mount routes expected by tests
app.use('/users', AuthRoute);
app.use('/users', passwordAuthMiddleware, HomeRoute);
app.use('/news', passwordAuthMiddleware, NewsRoute);

module.exports = app;
