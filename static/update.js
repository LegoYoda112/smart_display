const { response } = require("express");

// Holds the weather api link
let weatherurl;

function startTime(){
    // Gets today's date
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = padTime(m); // Pads the hours for times less than 10

    // Formats time and sets html element
    document.getElementById('time-title').innerHTML =
    h + ":" + m; 

    // Extracts day
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    // Formats date and sets htmnl element
    document.getElementById('date-title').innerHTML =
    day + "/" + month + "/" + year;

    // Sets update loop (ever 0.5 secs)
    var t = setTimeout(startTime, 500);
    console.log("updated time");
}

function padTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

// Function for updating the weather
async function updateWeather(){
    if(!weatherurl){ // If the weatherurl hasn't been set yet, retrieve it.
        console.log("Updating weather api key");
        weatherurl = await fetch('/weatherkey.txt');
        weatherurl = await weatherurl.text();
    }

    // Gets the url and then converts the response to JSON
    let response = await fetch(weatherurl);
    let data = await response.json();
    
    // Grabs today's weather
    let today_weather = data.current.weather[0].main;
    let today_temp = Math.round(data.current.temp);

    // Sets today's weather
    document.getElementById("today-weather").innerHTML = 
    today_weather + " " + today_temp + "°";

    // Grabs tomorrow's weather
    let tomorrow_weather = data.daily[1].weather[0].main;
    let tomorrow_temp = Math.round(data.daily[1].temp.day);

    // Sets tomorrow's weather
    document.getElementById("tomorrow-weather").innerHTML = 
    tomorrow_weather + " " + tomorrow_temp + "°";

    // Starts repeat. (every 10 mins)
    var t = setTimeout(updateWeather, 600000);
    console.log("updated weather");
}

async function updateCalendar(){
    // Gets calendar items for the next two days
    let response = await fetch("/cal");
    let data = await response.json();

    let today = new Date();

    // Gets item list divs and clears them
    let todayDiv = document.getElementById("today-items");
    todayDiv.innerHTML = "";
    let tomorrowDiv = document.getElementById("tomorrow-items");
    tomorrowDiv.innerHTML = "";

    let trash = document.getElementById("trash");
    trash.className = "box notakeout";

    for (i = 0; i < data.length; i++){

        // Make new item
        let newItem = document.createElement("p");
        eventName = data[i].summary;
        newItem.innerHTML = eventName;

        // Get event start and end date
        if(eventName === 'Bins'){
            startDate = new Date(data[i].start.dateTime);
            endDate = new Date(data[i].end.dateTime);
        }else{
            startDate = new Date(data[i].start.date);
            endDate = new Date(data[i].end.date);
        }

        // Debugging lines, uncomment if needed
        /* console.log(eventName);
        console.log(data[i]);
        console.log('eventIsToday: ', eventIsToday(today, startDate));
        console.log('eventIsOccuring: ', eventIsOccuring(today, startDate, endDate)); */

        if(eventIsToday(today, startDate) || eventIsOccuring(today, startDate, endDate)){
            // Sets class to be today and appends to correct div
            if(eventName == "Bins" && eventIsOccuring(today, startDate, endDate)){
                trash.className = "box takeout";
                newItem.className = "today-item";
                todayDiv.appendChild(newItem);
            }else{
                newItem.className = "today-item";
                todayDiv.appendChild(newItem);
            }
        }else{
            // Sets class to be tomorrow and appends to correct div
            newItem.className = "tomorrow-item";
            tomorrowDiv.appendChild(newItem);
        }
    }

    var t = setTimeout(updateCalendar, 60000);
    console.log("updated calendar");
}

async function updateBreakerCount() {
    // const {breakerCount, maxBreakerCount} = fs.readFile('breaker.json', (err, content) => {
    //     if (err) return console.log('Error loading breaker count file:', err);
    //     return JSON.parse(content);
    //   });
    console.log("updating breaker")
    breakerData = await fetch('/breaker.json').then( response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json()
    }).then(json => {
        const {breakerCount, maxBreakerCount} = json;
        document.getElementById('breaker-count').innerHTML = breakerCount;
        console.log(json)
        console.log(breakerCount)
        console.log(maxBreakerCount)
    });
    // co1nst {breakerCount, maxBreakerCount} = await breakerData.json();
    var t = setTimeout(updateBreakerCount, 60000);
    
}

async function incrBreakerCount() {
    updateBreakerCount();
}

function eventIsOccuring(today, startD, endD){
    if(startD <= today && today <= endD){
        return true;
    }else{
        return false;
    };
}

const eventIsToday = (today, startD) =>
    today.getFullYear() === startD.getFullYear() &&
    today.getMonth() === startD.getMonth() &&
    today.getDate() === startD.getDate();

// Checks to see if a datetime has passed
const datetimeHasPassed = (today, datetime) => today > datetime;

// When page content loads, start up all updater functions
window.addEventListener("DOMContentLoaded", function () {
    console.log("Starting...");
    startTime();
    updateWeather();
    updateCalendar();
    incrBreakerCount();
});



