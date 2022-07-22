var apiKey = '3547585f8bb679ae5ae71585bcf08d0f';
var date = moment().format("L");
var enteredCitiesList = [];

function currentWeather(city) {
	var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

	$.ajax({
		url: apiURL,
		method: 'GET',
	}).then(function (weatherDisplayed) {

		$('#searchedWeather').css('display', 'block');
		$('#cityInfo').empty();

		var icons = weatherDisplayed.weather[0].icon;
		var iconsURL = `https://openweathermap.org/img/w/${icons}.png`;

		var displayedCity = $(`<h2 id="currentCity" style="font-weight: bold">${weatherDisplayed.name} ${date} <img src="${iconsURL}"/></h2>
          <p>Temp: ${weatherDisplayed.main.temp}°F</p>
          <p>Wind: ${weatherDisplayed.wind.speed} MPH</p>
          <p>Humidity: ${weatherDisplayed.main.humidity} %</p>`);

		$('#cityInfo').append(displayedCity);

		var lat = weatherDisplayed.coord.lat;
		var lon = weatherDisplayed.coord.lon;
		var uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

		$.ajax({
			url: uviURL,
			method: 'GET',
		}).then(function (uviDisplayed) {

			var uvi = uviDisplayed.value;
			var shownUVI = $(`<p> UV Index: <div id="displayedColor" class="px-2 py-2 rounded">${uvi}</div></p>`);

			$('#cityInfo').append(shownUVI);

			futureWeather(lat, lon);

			if (uvi >= 0 && uvi < 3) {
                $("#displayedColor").css("background-color", "green");
                $("#displayedColor").css("color", "white");
            } else if (uvi >= 3 && uvi < 6) {
                $("#displayedColor").css("background-color", "yellow");
                $("#displayedColor").css("color", "white");
            } else if (uvi >= 6 && uvi < 8) {
                $("#displayedColor").css("background-color", "orange");
                $("#displayedColor").css("color", "white");
            } else if (uvi >= 8 && uvi < 11) {
                $("#displayedColor").css("background-color", "red");
                $("#displayedColor").css("color", "white");
            } else if (uvi >= 11) {
                $("#displayedColor").css("background-color", "violet");
                $("#displayedColor").css("color", "white");
            }
		});
	});
}

function futureWeather(lat, lon) {
	var futureWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
  
  var futureEl = document.getElementById("fiveDayForecastHeader");
  futureEl.textContent = "5-Day Forecast:";
  futureEl.style.fontWeight = "bold";
  futureEl.style.fontSize = "30px";


	$.ajax({
		url: futureWeatherURL,
		method: 'GET',
	}).then(function (displayedFutureWeather) {
		$('#fiveDayForecast').empty();

		for (let i = 1; i < 6; i++) {
			var fiveDays = {
				date: displayedFutureWeather.daily[i].dt,
                icon: displayedFutureWeather.daily[i].weather[0].icon,
                temp: displayedFutureWeather.daily[i].temp.day,
                wind: displayedFutureWeather.daily[i].wind_speed,
                humidity: displayedFutureWeather.daily[i].humidity,
			};
            var todaysDate = moment.unix(fiveDays.date).format("MM/DD/YYYY");
			var weatherIconsURL = `<img src="https://openweathermap.org/img/w/${fiveDays.icon}.png"/>`;
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
			$('#fiveDayForecast').append(displayedCard);
		}
	});
}

$('#btn').on('click', function (event) {
	event.preventDefault();

    $("#cityInfo").removeClass("hidden");
	var city = $('#typeCityName').val().trim();
	currentWeather(city);
	if (!enteredCitiesList.includes(city)) {
		enteredCitiesList.push(city);
		var citySearch = $(`
          <li>${city}</li>
          `);
		$('#enteredCities').append(citySearch);
	}

	localStorage.setItem('city', JSON.stringify(enteredCitiesList));
});

$(document).on("click", "li", function() {
    var clickedCity = $(this).text();
    currentWeather(clickedCity);
})