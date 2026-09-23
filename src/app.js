
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

// Feed API - Get /feed - get all users from db
app.get("/user", async (req,res) => {
    const userfname = req.body.firstName;

    try {
        const users = await User.findOne({ firstName : userfname});
        if(users.length === 0) {
            res.status(404).send("User not found");
        }
        else {
            res.send(users);
        }

    } catch (err) {
        res.status(400).send("Something went wrong");
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


