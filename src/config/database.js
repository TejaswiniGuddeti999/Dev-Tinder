require('dotenv').config();

const uri = process.env.MONGO_URI;
console.log("Connecting to:", uri);


const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(uri); 
};


module.exports = connectDB;