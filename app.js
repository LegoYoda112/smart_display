const express = require('express');
const calender = require('./calendar.js');
const fs = require('fs');

const port = 8080;
const app = express();

app.use("/", express.static("static"));

// Start server
app.listen(port, function () {
    console.log("Listening on port " + port);
    console.log("http://localhost:" + port);
});

app.use("/cal/", function (req, res) {
    calender.getCalEvents(res);
});

app.post("/breaker_update", function (req, res) {
    console.log("Updating Breaker")
    res.send("Updating Breaker")
    // const {breakerCount, maxBreakerCount} = {"b":0,"a":0};
    // const res = fs.readFile('/breaker.json', (err, content) => {
    //     if (err) return console.log('Error loading breaker file:', err);
    //     return JSON.parse(content);
    // });
    // // console.log(res);
    // const {increment} = JSON.parse(req.body);
    // console.log(increment)
    // breakerCount += increment;
    // maxBreakerCount = Math.max(breakerCount, maxBreakerCount);
    // fs.writeFile('/breaker.json', {'breakerCount': breakerCount, 'maxBreakerCount': maxBreakerCount});
});