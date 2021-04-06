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

let lastCheckDate = new Date().getDate();

app.get("/breaker", function (req, res) {
    let {breakerCount, maxBreakerCount} = JSON.parse(fs.readFileSync('breaker.json', 'utf-8'));
    todayDate = new Date().getDate();
    if (Math.abs(todayDate - lastCheckDate) > 0) {
        breakerCount += 1;
        maxBreakerCount = Math.max(breakerCount, maxBreakerCount);
    }
    lastCheckDate = todayDate;
    fs.writeFile('breaker.json', JSON.stringify({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount}), function (err) {});
    res.send({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount});
});

app.get("/reset_breaker", function (req, res) {
    let {breakerCount, maxBreakerCount} = JSON.parse(fs.readFileSync('breaker.json', 'utf-8'));
    breakerCount = 0;
    fs.writeFile('breaker.json', JSON.stringify({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount}), function (err) {});
    res.send(JSON.stringify({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount}));
});