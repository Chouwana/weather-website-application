// Feature 1: Date
function formatDate(date) {
  var hours = date.getHours();
  if (hours < 10) {
    hours = "0".concat(hours);
  }
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0".concat(minutes);
  }
  var dayIndex = date.getDay();
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var day = days[dayIndex];
  return "".concat(day, " ").concat(hours, ":").concat(minutes);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//Feature 3: Celcius Fahrenheit
function convertTemperature(event) {
  event.preventDefault();
  if (temperatureScale.checked === true) {
    convertToFahrenheit();
  } else {
    convertToCelsius();
  }
}
function convertToFahrenheit() {
  var temperatureElement = document.querySelectorAll(
    "#temperature, #forecast-temperature-max, #forecast-temperature-min, #forecast-degree"
  );
  temperatureElement.forEach(function (element) {
    element.innerHTML = Math.round((element.innerHTML * 9) / 5 + 32);
    if (element.id === "forecast-degree") {
      element.innerHTML = "°F";
    }
  });
}
function convertToCelsius() {
  var temperatureElement = document.querySelectorAll(
    "#temperature, #forecast-temperature-max, #forecast-temperature-min, #forecast-degree"
  );
  temperatureElement.forEach(function (element) {
    element.innerHTML = Math.round(((element.innerHTML - 32) * 5) / 9);
    if (element.id === "forecast-degree") {
      element.innerHTML = "°C";
    }
  });
}

function getForecast(city) {
  var apiKey = "e041e9c934fa1cfb18cabt1aa4cbb40o";
  var apiUrl = "https://api.shecodes.io/weather/v1/forecast?query="
    .concat(city, "&key=")
    .concat(apiKey, "&units=metric");
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<h3>5-DAY FORECAST</h3>`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col border-right">
                <div class="WeatherForecastPreview">
                  <div class="forecast-day">${formatDay(forecastDay.time)}</div>
                  <img src="${
                    forecastDay.condition.icon_url
                  }" width="32" height="32" />
                  <div id="forecast-temperature" class="forecast-temperature">
                    <span class="forecast-temperature-max" id="forecast-temperature-max">${Math.round(
                      forecastDay.temperature.maximum
                    )}</span>
                    <span class="forecast-temperature-max" id="forecast-degree">°C</span>
                  </br>
                      <span class="forecast-temperature-min" id="forecast-temperature-min">${Math.round(
                        forecastDay.temperature.minimum
                      )}</span>
                      <span class="forecast-temperature-min" id="forecast-degree">°C</span>
                  </div>
                </div>
              </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function displayWeatherCondition(response) {
  var temperatureScale = document.querySelector("#switch");
  temperatureScale.checked = false;
  document.querySelector("#cityName").innerHTML = response.data.city;
  document.querySelector("#date-condition").innerHTML = formatDate(
    new Date()
  ).concat(" | ", response.data.condition.description);
  document.querySelector("#weather-icon").src =
    response.data.condition.icon_url;
  document.querySelector("#humidity").innerHTML = "".concat(
    response.data.temperature.humidity,
    "%"
  );
  document.querySelector("#speed").innerHTML = "".concat(
    response.data.wind.speed,
    " km/h"
  );
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );

  getForecast(response.data.city);
}

function searchCity(city) {
  var apiKey = "e041e9c934fa1cfb18cabt1aa4cbb40o";
  var apiUrl = "https://api.shecodes.io/weather/v1/current?query="
    .concat(city, "&key=")
    .concat(apiKey, "&units=metric");
  axios.get(apiUrl).then(displayWeatherCondition);
}

function searchCurrentLocation(position) {
  var apiKey = "e041e9c934fa1cfb18cabt1aa4cbb40o";
  var apiUrl = "https://api.shecodes.io/weather/v1/current?lon="
    .concat(position.coords.longitude, "&lat=")
    .concat(position.coords.latitude, "&key=")
    .concat(apiKey, "&units=metric");
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function submitCitySearchInput(event) {
  event.preventDefault();
  var cityInput = document.querySelector("#city-input").value;
  searchCity(cityInput);
}

var dateElement = document.querySelector("#date-condition");
var currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);
searchCity("Manila");

var citySearchForm = document.querySelector("#citysearch-form");
citySearchForm.addEventListener("submit", submitCitySearchInput);

var currentLocationButton = document.querySelector("#currentButton");
currentLocationButton.addEventListener("click", getCurrentLocation);

var temperatureScale = document.querySelector("#switch");
temperatureScale.addEventListener("change", convertTemperature);
