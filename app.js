const express = require('express');
const calender = require('./calendar.js');

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