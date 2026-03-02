const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Static folder for images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', require('./routes/productRoutes'));

app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
