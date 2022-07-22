// defined the apiKey I got from openweather
var apiKey = '3547585f8bb679ae5ae71585bcf08d0f';
// sets the current date from moment()
var date = moment().format("L");
// search history for the entered cities
var enteredCitiesList = [];

// function for the current weather in the city typed
function currentWeather(city) {
    // defines an apiURL to get the weather from the entered city using the apiKey I got from openweather
	var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

	$.ajax({
        // gets the apiURL
		url: apiURL,
		method: 'GET',
        // then weatherDisplayed function starts
	}).then(function (weatherDisplayed) {

        // displays the searchedWeather id in a block
		$('#searchedWeather').css('display', 'block');
        // deletes the previous displayed weather info after inputting a new city
		$('#cityInfo').empty();

        // defines a variable icons that sets the icon to the current dates weather
		var icons = weatherDisplayed.weather[0].icon;
        // defines the url from openweather to grab their icons and display them with the current weather
		var iconsURL = `https://openweathermap.org/img/w/${icons}.png`;

        // displayedcity variable that sets the h2 font-weight as bold and gives the name of the city alongside the date and the img src from the iconsURL defined above
        // sets the p temp to the current temperature with °F by it
        // sets the wind to be the speed of the wind with MPH by it
        // sets the humidity to be the current humidity with a % by it
		var displayedCity = $(`<h2 id="currentCity" style="font-weight: bold">${weatherDisplayed.name} ${date} <img src="${iconsURL}"/></h2>
          <p>Temp: ${weatherDisplayed.main.temp}°F</p>
          <p>Wind: ${weatherDisplayed.wind.speed} MPH</p>
          <p>Humidity: ${weatherDisplayed.main.humidity} %</p>`);

          // Appends the displayedCity variable to the cityInfo id defined in the html displaying it
		$('#cityInfo').append(displayedCity);

        // defines a variable lat to be the entered city's latitude
		var lat = weatherDisplayed.coord.lat;
        // defines a variable lon to be the entered city's longitude
		var lon = weatherDisplayed.coord.lon;

        // defines the uviURL to get the defined latitude and longitude along with the apiKey
		var uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

		$.ajax({
            // gets the uviURL
			url: uviURL,
			method: 'GET',
            // then uviDisplayed function starts
		}).then(function (uviDisplayed) {

            // defines a variable uvi to grab the current uvi value
			var uvi = uviDisplayed.value;
            // defines a variable shownUVI that creates a p tag with the UV Index: and then a displayed color id with the defined uvi variable above
			var shownUVI = $(`<p> UV Index: <div id="displayedColor" class="px-2 py-2 rounded">${uvi}</div></p>`);

            // appends the shownUVI to the cityInfo id defined in the html displaying it
			$('#cityInfo').append(shownUVI);

            // futureWeather function begins using the longitude and latitude of the entered city
			futureWeather(lat, lon);

            // if the uvi is >= 0 and < 3 the background color will be green and the text white
			if (uvi >= 0 && uvi < 3) {
                $("#displayedColor").css("background-color", "green");
                $("#displayedColor").css("color", "white");
                // if the uvi is >= 3 and < 6 the background color will be yellow and the text white
            } else if (uvi >= 3 && uvi < 6) {
                $("#displayedColor").css("background-color", "yellow");
                $("#displayedColor").css("color", "white");
                // if the uvi is >= 6 and < 8 the background color will be orange and the text white
            } else if (uvi >= 6 && uvi < 8) {
                $("#displayedColor").css("background-color", "orange");
                $("#displayedColor").css("color", "white");
                // if the uvi is >= 8 and < 11 the background color will be red and the text white
            } else if (uvi >= 8 && uvi < 11) {
                $("#displayedColor").css("background-color", "red");
                $("#displayedColor").css("color", "white");
                // if the uvi is >= 11 then the background color will be violet and the text white
            } else if (uvi >= 11) {
                $("#displayedColor").css("background-color", "violet");
                $("#displayedColor").css("color", "white");
            }
		});
	});
}

// defines the futureWeather function with the latitude and longitude as variables defined above
function futureWeather(lat, lon) {
    // defines a variable futureWeatherURL as the URL with the latitude and longitude and apiKey as parameters to get the 5-day forecast
	var futureWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
  
    // defines a variable futureEl to get the id fivedayforecastheader defined in the html
  var futureEl = document.getElementById("fiveDayForecastHeader");
  // displays 5-Day Forecast: as the text content
  futureEl.textContent = "5-Day Forecast:";
  // styles the text content to be bold
  futureEl.style.fontWeight = "bold";
  // styles the text content to be 30px
  futureEl.style.fontSize = "30px";


	$.ajax({
        // gets the futureWeatherURL
		url: futureWeatherURL,
		method: 'GET',
        // then displayedFutureWeather function starts
	}).then(function (displayedFutureWeather) {
        // empties the previous city's five day forecast so they don't stack on top of each other
		$('#fiveDayForecast').empty();

        // for loop setting the future weather to be five days only
		for (let i = 1; i < 6; i++) {
			var fiveDays = {
                // gives the date for the 5 day forecast
				date: displayedFutureWeather.daily[i].dt,
                // gives the icon for the 5 day forecast
                icon: displayedFutureWeather.daily[i].weather[0].icon,
                // gives the temperature for the 5 day forecast
                temp: displayedFutureWeather.daily[i].temp.day,
                // gives the wind speed for the 5 day forecast
                wind: displayedFutureWeather.daily[i].wind_speed,
                // gives the humidity for the 5 day forecast
                humidity: displayedFutureWeather.daily[i].humidity,
			};
            // defines the 5 days dates from moment
            var todaysDate = moment.unix(fiveDays.date).format("MM/DD/YYYY");
            // sets the weatherIconsURL using the fiveDays icon variable
			var weatherIconsURL = `<img src="https://openweathermap.org/img/w/${fiveDays.icon}.png"/>`;
            //defines a variable displayedCard by creating cards with the five day info including the date, an icon, the temp, the wind, and the humidity
			var displayedCard = $(`<div class="pl-3">
            <div class="card pl-3 pt-3 mb-3 bg-dark text-light" style="width: 10rem;>
            <div class="card-body">
              <h6>${todaysDate}</h6>
              <p>${weatherIconsURL}</p>
              <p>Temp: ${fiveDays.temp} °F</p>
              <p>Wind: ${fiveDays.wind} MPH</p>
              <p>Humidity: ${fiveDays.humidity} %</p>
            </div>
          </div>
        <div>`);
        // appends the displayedCard to the fiveDayForecast id defined in the html
			$('#fiveDayForecast').append(displayedCard);
		}
	});
}

// defines a function that goes when the search button is clicked
$('#btn').on('click', function (event) {
    // prevents default actions from occurring
	event.preventDefault();

    // removes the class hidden from cityInfo
    $("#cityInfo").removeClass("hidden");
    // defines a city variable with the value of the entered city name
	var city = $('#typeCityName').val();
    // begins the currentWeather(city) function
	currentWeather(city);
    // if the entered city is new to the list then push the city to the history
	if (!enteredCitiesList.includes(city)) {
		enteredCitiesList.push(city);
        // defines a variable citySearch that creates a li with the entered city
		var citySearch = $(`<li>${city}</li>`);
        // appends the citySearch to the enteredCities id defined in the html
		$('#enteredCities').append(citySearch);
	}

    // sets the city to localStorage and stringifies all the enteredcities 
	localStorage.setItem('city', JSON.stringify(enteredCitiesList));
});

// when clicking the li of one of the cities in the history it displays that previous cities information
$(document).on("click", "li", function() {
    var clickedCity = $(this).text();
    currentWeather(clickedCity);
})
