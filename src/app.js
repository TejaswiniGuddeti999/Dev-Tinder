
const express = require('express');

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");

app.use(express.json());

app.post("/signup" ,async (req,res) => {
    
    // creating a new instance of the user model
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully")
    }
    catch (err) {
        res.status(400).send("error saving the user:" + err.message);
    }
    
});

connectDB()
    .then(() => {
        console.log("Database connection established successfully");
        app.listen(3000, () => {
        console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.log("Database cannot be connected due to the following error: " + err.message);
    });


