const express = require('express');

const app = express();

// order matters
app.use("/getuser",(req,res) => {
    res.send("hahahahhah")
})


// THis will only handle GET call to /getuser
app.get("/getuser",(req,res) => {
    res.send({name: "John Doe", email: "john.doe@example.com"})
})

// tHIS ONLT HANDLES POSt call to /postuser
app.post("/postuser",(req,res) => {
    console.log("Save data to the database");
    res.send("Data sucessfully saved to the database")
})

// app.use matches all the http method api calls to /something/testing
// the below route(/something) gets overridden if order is not correct, so this route should be at the beginning
app.use("/something/testing",(req,res) => {
    // request hadler
    res.send("Testing the order of routes and this should be the first route to be hit")
})


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

// app.use("/",(req,res) => {
//     // request hadler
//     res.send("This overrides everything and will be the default route so this should be used at the end")
// })


app.listen(9000, () => {
    console.log("Server is successfully listening on port 9000")
});

