
const express = require('express');

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");

app.use(express.json());

app.post("/signup" ,async (req,res) => {
    
    // creating a new instance of the user model
    const user = new User(req.body);
    
    try {
        if (user?.skills.length > 10){
        throw new Error ("skills cannot be more than 10 ");
        }
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
        const users = await User.find({ firstName : userfname});
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

// delete api
app.delete("/del", async(req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);

        res.send("User deleted successfully")
    } 
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

// Update data of users
app.patch("/upd/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
        "photoUrl", "about", "gender", "age", "skills"
    ]

    const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
        return res.status(400).send("Update not allowed");
    };
    if (data.skills && data?.skills.length > 10){
        throw new Error ("skills cannot be more than 10 ");
    }
    try {
        const user = await User.findByIdAndUpdate(userId , data, {
            returnDocument: "after",
            runValidators : true,
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err) { 
        res.status(400).send("Something went wrong" + err.message);
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


