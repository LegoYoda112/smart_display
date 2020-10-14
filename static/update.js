

function startTime(){
    var today = new Date();
    var h = today.getHours() % 13;
    var m = today.getMinutes();
    m = padTime(m);
    document.getElementById('time-title').innerHTML =
    h + ":" + m;

    var day = today.getDate();
    var month = today.getMonth() + 1;5
    var year = today.getFullYear();
    document.getElementById('date-title').innerHTML =
    day + "/" + month + "/" + year;

    var t = setTimeout(startTime, 500);
    console.log("updated time");
}

function padTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

async function updateWeather(){
    let response = await fetch('');
    let data = await response.json();

    let today_weather = data.current.weather[0].main;
    let today_temp = Math.round(data.current.temp);

    document.getElementById("today-weather").innerHTML = 
    today_weather + ". " + today_temp + "°";

    let tomorrow_weather = data.daily[1].weather[0].main;
    let tomorrow_temp = Math.round(data.daily[1].temp.day);

    document.getElementById("tomorrow-weather").innerHTML = 
    tomorrow_weather + ". " + tomorrow_temp + "°";

    var t = setTimeout(updateWeather, 60000);
    console.log("updated weather");
}

async function updateCalender(){
    // Gets calender items for the next two days
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

        // Get event start date
        date = new Date(data[i].start.date);

        // Make new item
        let newItem = document.createElement("p");
        eventName = data[i].summary;
        newItem.innerHTML = eventName;

        if(datesAreOnSameDay(today, date)){
            // Sets class to be today and appends to correct div
            if(eventName == "Bins"){
                console.log("Stuff lmao");
                trash.className = "box takeout";
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

    var t = setTimeout(updateCalender, 60000);
    console.log("updated calender");
}

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

window.addEventListener("DOMContentLoaded", function () {
    console.log("Starting...");
    startTime();
    updateWeather();
    updateCalender();
});



