require('dotenv').config();

const uri = process.env.MONGO_URI;

const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(uri);
};


module.exports = connectDB;