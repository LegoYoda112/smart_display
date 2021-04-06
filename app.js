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
    // res.send("Updating Breaker")
    fs.readFile('breaker.json', (err, content) => {
        if (err) return console.log('Error loading breaker file:', err);
        data = JSON.parse(content);
    });
    // res.send(data);
    // const {increment} = JSON.parse(req.body);
    // // res.send(increment)
    breakerCount += 1;
    maxBreakerCount = Math.max(breakerCount, maxBreakerCount);
    fs.writeFile('breaker.json', JSON.stringify({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount}));
    console.log(breakerCount + " : " + maxBreakerCount);
});

app.use("/cal/", function (req, res) {
    calender.getCalEvents(res);
});

// app.use("/breaker_update/", function (req, res) {
//     console.log("Updating Breaker");
// });