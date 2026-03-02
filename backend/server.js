require('dotenv').config();
const express = require("express");
const cors = require("cors")
const app = express();
const http = require('http');
// const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false}));

//routes


// Connect to Database
connectDB();

const server = http.createServer(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
