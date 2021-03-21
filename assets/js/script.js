
var searchBtn = $('.btn');
var searchForm = $('.form-control');
var cityList = $('.list-group')
var citySearched = ''

var savedCities = {city:""}

var today = moment().format("LL")

var forecastDays = {
  "0":{
    date:"",
    icon:"",
    temp:"",
    humidity:""
  },
  "1":{
    date:"",
    icon:"",
    temp:"",
    humidity:""
  },
  "2":{
    date:"",
    icon:"",
    temp:"",
    humidity:""
  },
  "3":{
    date:"",
    icon:"",
    temp:"",
    humidity:""
  },
  "4":{
    date:"",
    icon:"",
    temp:"",
    humidity:""

  }
}

searchBtn.on('click', function(event){
  event.preventDefault();
   //get city name after search button is typed
    //get value of text input into search form
    citySearched = $('input[name="city-input"]').val();

    if(!citySearched) {
        alert('you must type a city')
        return
    }
    //append list item with submitted city
    cityList.append('<li class="list-group-item">' + citySearched + '</li>' )
    var coordinatesRequestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+citySearched+'&units=imperial&id=524901&appid=ab7266a3a00f62e9f68c69fe3c45b0e5'

    geolocationCoordinates(coordinatesRequestUrl, citySearched);
    //empty search form box
    $('input[name="city-input"]').val('');
    
});

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
    console.log(response)
    displayCurrentWeather(data, citySearched);
    displayForecast(data, citySearched);
  });
}

// display current data on page
function displayCurrentWeather(data, citySearched){
    //display city name using citySearched variable
    var cityName = $('.card-title');
      //add icon to end of city name 
        cityName.html(citySearched + '<img src = http://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png></img>' );
      //translate unixcode given from api display as date
        unixCode= data.current.dt
        var date= (moment.unix(unixCode.toString()).format('LL'))
        var dateDisplay = $('.card-subtitle')
        dateDisplay.html(date)
      
    //add current temp, humidity, wind speed, uvi to page
    var description = $('.card-text')
    var output = '<span class= "current-temp">' + data.current.temp.toFixed(0) + '&#8457' + '</span>';
        output += '<br> Humidity ' + data.current.humidity + '%.';
        output += '<br> Wind Speed: ' + data.current.wind_speed.toFixed(0) + 'mph.'
        //change uvi text color based on good, moderate, and severe uvi index
        if (data.current.uvi <= 2){
          output += '<br> <span class= "good-uv">UV index:' + data.current.uvi + '</span>'
        } else if (data.current.uvi  <= 7){
          output += '<br> <span class= "moderate-uv">UV index:' + data.current.uvi + '</span>'
        } else {
          output += '<br> <span class= "high-uv">UV index:' + data.current.uvi + '</span>'
        }
        //display data in description.
        description.html(output);
}

//display future forecast
function displayForecast(data){
    //loop to populate forecast cards
    for (let i = 1; i < 6; i++) {
      var layout = $('.layout')
  
      var forecastCard = $('<div class="card col-6 col-md-4 col-lg-2">')
        layout.append(forecastCard);
    
      var cardBody = $('<div class="card-body">')
        forecastCard.append(cardBody);
          
      var cardTitle = $('<h5 class= "card-title">');
        cardBody.append(cardTitle);
        unixCode= data.daily[i].dt
        var date= (moment.unix(unixCode.toString()).format('LL'))
        cardTitle.text(date)

      var weatherIcon = $('<img class="weather-icon">')
        weatherIcon.attr('src', 'http://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png')
        cardTitle.append(weatherIcon);

      var weatherDescription = $('<p>');
        cardBody.append(weatherDescription);  
        var output= '<span class ="forecast-temp">' + data.daily[i].temp.max.toFixed(0) + '&#8457' + ' / ' + data.daily[i].temp.min.toFixed(0) + '&#8457' + "</span>";
          output += '<br>Humidity: ' + data.daily[i].humidity + '%.';
          output += '<br> Wind Speed: ' + data.daily[i].wind_speed.toFixed(0) + 'mph.'
          if (data.daily[i].uvi <= 2){
            output += '<br> <span class= "good-uv">UV index:' + data.daily[i].uvi + '</span>'
          } else if (data.daily[i].uvi  <= 7){
              output += '<br> <span class= "moderate-uv">UV index:' + data.daily[i].uvi + '</span>'
          } else {
              output += '<br> <span class= "high-uv">UV index:' + data.daily[i].uvi + '</span>'
          }
      weatherDescription.html(output);
  }     
}