let express = require('express');
let mongoose = require('mongoose');
const { connectMongoDb } = require("./connection");
let userRoute = require('./ROUTS/Userrout');
let MessageRout = require('./ROUTS/Messagerout');
let cors = require('cors');

const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = 8000;

connectMongoDb('mongodb://127.0.0.1:27017/Chatapp').then(() => {
    console.log("MongoDB connected");
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your React app's origin
    credentials: true, // Allow credentials (cookies, authorization headers)
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", MessageRout);

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
