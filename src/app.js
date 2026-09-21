const express = require('express');

const app = express();


const {adminAuth,userAuth} = require("./middlewares/auth.js");

app.use("/admin", adminAuth);

app.get("/user",userAuth, (req,res) => {
    res.send("USer Data Sent");
});

app.get("/user/login", (req,res) => {
    res.send("User Logged In");
});


app.get("/admin/getAllData", (req,res) => {
    res.send("All data Sent");
});

app.get("/admin/deleteUser", (req,res) => {
    res.send("User deleted");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

