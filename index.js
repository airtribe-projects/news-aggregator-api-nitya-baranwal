const app = require('./app');

require('dotenv').config();
const port = process.env.PORT;

const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl).then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log("Error connecting to database", err);
}).finally(() => {
    console.log("Database connection attempt finished");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});