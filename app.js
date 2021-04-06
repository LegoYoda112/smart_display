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
    // fs.readFile('breaker.json', 'utf-8', (err, content) => {
    //     if (err) return console.log('Error loading breaker file:', err);
    //     let {breakerCount, maxBreakerCount} = JSON.parse(content);
    //     // breakerCount += 1;
    //     // maxBreakerCount = Math.max(breakerCount, maxBreakerCount);
    //     fs.writeFile('breaker.json', JSON.stringify({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount}));
    //     console.log(breakerCount + " : " + maxBreakerCount);
    // });
    // res.send(data);
    // const {increment} = JSON.parse(req.body);
    // // res.send(increment)
});

app.use("/cal/", function (req, res) {
    calender.getCalEvents(res);
});

app.get("/breaker", function (req, res) {
    let breaker = JSON.parse(fs.readFileSync('breaker.json', 'utf-8'));
    res.send(breaker);
});

app.get("/update_breaker", function (req, res) {
    let {breakerCount, maxBreakerCount} = JSON.parse(fs.readFileSync('breaker.json', 'utf-8'));
    breakerCount += 1;
    maxBreakerCount = Math.max(breakerCount, maxBreakerCount);
    fs.writeFile('breaker.json', JSON.stringify({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount}), function (err) {});
    res.send(JSON.stringify({breakerCount: breakerCount, maxBreakerCount: maxBreakerCount}));
});