const express = require('express');

const app = express();

// app.use("/route",rH, [rH2,rH3],rH4,rH5) --can use multiplerounte handler arrays inside

app.use("/user", [(req,res,next) => {
    // nothing
    console.log("Handling route user")
    next();
    // res.send("Response 1");
},
// multi route handler
(req,res,next) => {
    console.log("Handling route user - 2");
    next();
    // res.send("Response 2")
}],
(req,res,next) => {
    console.log("Handling route user -3");
    next();
    // res.send("Response 3")
},
(req,res,next) => {
    console.log("Handling route user - 4");
    next();
    // res.send("Response 4")
},
(req,res,next) => {
    console.log("Handling route user - 5");
    next();
    res.send("Response 5")
}

f);

app.listen(7777, () => {
    console.log("Server is running on port 7777");
});