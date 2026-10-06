const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
           const fromUserId =  req.user._id;
           const toUserId = req.params.toUserId;
           const status = req.params.status;

           const allowedStatus = ["Ignored", "Interested"];
           if (!allowedStatus.includes(status)) {
                return res.status(400).json({message : "Invalid status type: "+ status});
           }

          
           // If there is existing connectionr request

           const toUser = await User.findById(toUserId);
           if (!toUser) {
            return res.status(404).json({message : "User not found"});
           }



           const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]
           });
           if (existingConnectionRequest) {
            return res.status(400).send({message: "Connection request already exists"})
           }

            const connectionRequest = new ConnectionRequestModel({
                fromUserId,
                toUserId,
                status, 
           });

            const data = await connectionRequest.save();

            res.json({
            message: "connection sent successfully",
            data,
           })

        }
        catch (err) {
            res.status(400).send("ERROR: " + err.message);
        }
        
    }
    );



requestRouter.post(
    "/request/review/:status/:requestId",
     userAuth,
     async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ['Accepted', 'Rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Status not allowed"});
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "Interested",
        })
        if (!connectionRequest) {
            return res
            .status(404)
            .json({message : "Connection request not found"})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request " + status, data });

        // vidheesh -> Teju
        // check if loggedin user is touserid(Teju )
        //  status = Interested (status should be interested)
        // request Id should be valid

    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = requestRouter;


