const express = require('express');

const app = express();


app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong");
}
});

app.get("/getUserDAta", (req, res) => {
    try {
        // logic
        throw new Error("Something went wrong");
        console.log("HEre is user data")
    }
    catch (err) {
        res.send("Please Contact Support Team");
    }
   });




app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

