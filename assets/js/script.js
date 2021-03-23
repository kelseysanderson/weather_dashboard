var searchBtn = $('.btn');
var searchForm = $('.form-control');
var cityList = $('.list-group');
var citySearched = '';
var cityEntered=false;
var today = moment().format("LL");
var forecastDays = ["0","1","2","3","4"];
var cityNames=[];
var listId = 0

function init(){
  var savedCities = JSON.parse(localStorage.getItem('cities'));
  if( savedCities != null){
    cityNames = savedCities;
  }
  for (let i = 0; i < cityNames.length; i++) {
    cityList.append('<li class="list-group-item">' + cityNames[i] + '</li>' );
  }
}

//get city name after search is submitted
function cityInput(event){
  event.preventDefault();
    //get value of text input into search form
    citySearched = $('input[name="city-input"]').val();
    citySearched = citySearched.charAt(0).toUpperCase() + citySearched.slice(1);

    cityNames.push(citySearched);

    if(!citySearched) {
        alert('you must type a city');
        return;
    }
    //append list item with submitted city
    citySearchedList = $('<li>');
      citySearchedList.attr('class', 'list-group-item');
      citySearchedList.text(citySearched);

    cityList.append(citySearchedList);
    
    var coordinatesRequestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+citySearched+'&units=imperial&id=524901&appid=ab7266a3a00f62e9f68c69fe3c45b0e5';

    storeCities();
    geolocationCoordinates(coordinatesRequestUrl, citySearched);
    //empty search form box
    $('input[name="city-input"]').val('');
}

function storeCities(){
  var strCityNames = JSON.stringify(cityNames);
  localStorage.setItem('cities', strCityNames);
}

//get geolocation coordinates of city from api
function geolocationCoordinates(coordinatesRequestUrl, citySearched){
  $.ajax({
    url: coordinatesRequestUrl,
    method: 'GET',
  }).then(function (response){
    var lat = response[0].lat;
    var lon = response[0].lon;

    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&id=524901&appid=ab7266a3a00f62e9f68c69fe3c45b0e5'

    fetchWeatherData(requestUrl, citySearched);
  });
}

//use geolocation coordinates to get weather data
function fetchWeatherData(requestUrl, citySearched){
  $.ajax({
    url: requestUrl,
    method: 'GET',
  }).then(function (response){
    var data= response
    displayCurrentWeather(data, citySearched);
    displayForecast(data, citySearched);
  });
}

// display current data on page
function displayCurrentWeather(data, citySearched){
    //display city name using citySearched variable
    var cityName = $('.card-title');
      //add icon to end of city name 
        cityName.html(citySearched + '<img src = https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png></img>' );
      //translate unixcode given from api display as date
        unixCode= data.current.dt
        var date= (moment.unix(unixCode.toString()).format('LL'));
        var dateDisplay = $('.card-subtitle');
        dateDisplay.html(date);
      
    //add current temp, humidity, wind speed, uvi to page
    var description = $('.card-text')
    var output = '<span class= "current-temp">' + data.current.temp.toFixed(0) + '&#8457' + '</span>';
        output += '<br> Humidity ' + data.current.humidity + '%.';
        output += '<br> Wind Speed: ' + data.current.wind_speed.toFixed(0) + 'mph.'
        //change uvi text color based on good, moderate, and severe uvi index
        if (data.current.uvi <= 2){
          output += '<br> <span class= "good-uv">UV index: ' + data.current.uvi.toFixed(0) + '</span>'
        } else if (data.current.uvi  <= 7){
          output += '<br> <span class= "moderate-uv">UV index: ' + data.current.uvi.toFixed(0) + '</span>'
        } else {
          output += '<br> <span class= "high-uv">UV index: ' + data.current.uvi.toFixed(0) + '</span>'
        }
        //display data in description.
        description.html(output);
}

//display future forecast
function displayForecast(data){
    var layout = $('.layout');
    layout.html('');
    //loop to populate forecast cards
    for (let i = 1; i < 6; i++) {   
      
      var forecastCard = $('<div>');
        layout.append(forecastCard);
        forecastCard.attr('class', 'card')
        forecastCard.attr('style', 'margin:2px;')

      var cardBody = $('<div>');
        forecastCard.append(cardBody);
        cardBody.attr('style', 'padding:10px; text-align:center;')
      
      //translate unix from api and display date on card
      var dateTitle = $('<h5>');
        dateTitle.attr('class','date-title');
        cardBody.append(dateTitle);
        unixCode= data.daily[i].dt;
        var date= (moment.unix(unixCode.toString()).format('LL'));
        dateTitle.text(date);

      //add weather icon by date
      var weatherIcon = $('<img>');
        weatherIcon.attr('class','weather-icon');
        weatherIcon.attr('src', 'https://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png');
        dateTitle.append(weatherIcon);

      //uvi index
      var weatherDescription = $('<p>');
        cardBody.append(weatherDescription);  
        var output= '<span class ="forecast-temp">' + data.daily[i].temp.max.toFixed(0) + '&#8457' + ' / ' + data.daily[i].temp.min.toFixed(0) + '&#8457' + "</span>";
          output += '<br>Humidity: ' + data.daily[i].humidity + '%.';
          output += '<br> Wind Speed: ' + data.daily[i].wind_speed.toFixed(0) + 'mph.';
          if (data.daily[i].uvi <= 2){
            output += '<br> <span class= "good-uv">UV index: ' + data.daily[i].uvi.toFixed(0) + '</span>';
          } else if (data.daily[i].uvi  <= 7){
              output += '<br> <span class= "moderate-uv">UV index: ' + data.daily[i].uvi.toFixed(0) + '</span>';
          } else {
              output += '<br> <span class= "high-uv">UV index: ' + data.daily[i].uvi.toFixed(0) + '</span>';
          }
      weatherDescription.html(output);
  }     
}

searchBtn.on('click', cityInput);

$(document).on('click', '.list-group-item', function(){
  var coordinatesRequestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+$(this).text()+'&units=imperial&id=524901&appid=ab7266a3a00f62e9f68c69fe3c45b0e5'
  geolocationCoordinates(coordinatesRequestUrl, $(this).text());
});

init();

//clear button?
//arrange forecast under current weather?