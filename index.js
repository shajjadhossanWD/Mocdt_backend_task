const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fe3phdc.mongodb.net/?authMechanism=SCRAM-SHA-1&authSource=emailapp`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Routes
app.use('/api/emails', require('./Router/emailRoutes'))
app.use('/api/v1/user', require('./Router/UserSignInSignUpRouter'))


app.get("/", (req, res) => {
    res.send("Server Running...");
  })

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
