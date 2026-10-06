const {userAuth} = require("../middlewares/auth")
const express = require("express")
const userRouter = express.Router();
const connectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
const USER_SAFE_DATA = "firstName lastName about skills photoUrl"

userRouter.get("/user/requests", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "Interested"
        }).populate(
            "fromUserId",
             USER_SAFE_DATA);

        res.json({
            message : "Data fetched successfully"
,           data: connectionRequests
        });
    }
    catch (err){
        res.statusCode(400).send("ERROR" + err.message)
    }
})


userRouter.get("/user/connections", userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "Accepted"},
                {fromUserId: loggedInUser._id, status: "Accepted"}
            ]
        }).populate("toUserId" , USER_SAFE_DATA)
          .populate("fromUserId" , USER_SAFE_DATA)
        
        const data = connectionRequests.map((row) =>{
            if (row.toUserId._id.toString() === loggedInUser._id.toString()){
                return row.fromUserId;
            }
            else {
                return row.toUserId;
            }
        })

        res.json({
            message: "connections fetched successfully",
            connections: data,
        })
        
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


userRouter.get("/feed", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user;


        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await connectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.toUserId.toString());
            hideUsersFromFeed.add(req.fromUserId.toString());
        })

        
        // console.log(hideUsersFromFeed);
        const users = await User.find({
            $and:[
                {_id: { $nin: Array.from(hideUsersFromFeed)}},
                {_id: { $ne: loggedInUser._id}}
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)
        

        res.send(users)
    }

    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});



module.exports = userRouter;
