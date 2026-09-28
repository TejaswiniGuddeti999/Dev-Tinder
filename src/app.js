
const express = require('express');
const connectDB = require("./config/database");
const {validateSignUpData} = require("./utils/validation");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middlewares/auth")


app.use(express.json());
app.use(cookieParser());


app.post("/signup" ,async (req,res) => {

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

app.post("/login", async (req,res) => {
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

app.get("/profile", userAuth,  async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    }
    catch (err) {
        res.status(400).send("ERROR:" +err.message);
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

app.post("/sendConnectionRequest",userAuth, async (req, res) => {
    const user = req.user;
    // Sending connecton request
    console.log("Sending connection request");
    res.send(user.lastName+ " has sent the connection request")
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


