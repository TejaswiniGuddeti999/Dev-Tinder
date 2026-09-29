const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("../utils/validation");

authRouter.post("/signup" ,async (req,res) => {

    try {
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body

        // Encrypt pass
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        // creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });

        await user.save();
        res.send("User added successfully");
    }
    catch (err) {
        res.status(400).send("error saving the user:" + err.message);
    }
    
});

authRouter.post("/login", async (req,res) => {
    try {
        const { emailId, password} = req.body;

        const user = await User.findOne({ emailId : emailId});

        if (!user) {
            throw new Error("Invalid credentials!!")
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid){
            // create a token
            const token = await user.getJWT();
            
            res.cookie("token", token, {
                expires : new Date(Date.now() + 8 * 3600000), 
            });
            res.send("Login successful");
        }   
        else {    
            throw new Error("Invalid credentials!")
        }
    }
    catch (err) {
        res.status(400).send("ERROR:" +err.message);
    
    }
});

module.exports = authRouter;