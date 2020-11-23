// jshint esversion: 6
const config = require("./config.js");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  var query = req.body.cityName;
  var units = req.body.units;
  var url = "https://api.openweathermap.org/data/2.5/weather?appid=" + config.API_KEY + "&q=" + query + "&units=" + units;

  https.get(url, function(response){
    if (response.statusCode == 200) {
      response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const temp = Math.round(weatherData.main.temp);
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        // res.write("<h1>The temperature in " + query + " is " + temp +  " degrees Fahrenheit.</h1>");
        // res.write("<h2>The weather is currently " + weatherDescription + "</h2>");
        // res.write("<img src=" + imageUrl + ">");
        res.render('weather.html', {temp: temp, location: query, weather: weatherDescription, weatherPhoto: imageUrl, units: units});
      });
    } else {
      res.render('failure.html');
    }
  });
});

app.listen(3000, function() {
  console.log("Server is being served on port 3000.");
});
