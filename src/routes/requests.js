const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");



requestRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
    const user = req.user;
    // Sending connecton request
    console.log("Sending connection request");
    res.send(user.lastName+ " has sent the connection request")
});

 
module.exports = requestRouter;