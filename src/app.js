const express = require('express');

const app = express();

app.use("/something",(req,res) => {
    // request hadler
    res.send("Hello from Something Server and checking something")
})

app.use("/somethingelse",(req,res) => {
    // request hadler
    res.send("Hello from Something Else Server and checking if nodemon is working")
})

app.use("/nothing",(req,res) => {
    // request hadler
    res.send("Hello from Nothing Server")
})




app.listen(9000, () => {
    console.log("Server is successfully listening on port 9000")
});

