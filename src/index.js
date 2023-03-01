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
  var temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(
    (temperatureElement.innerHTML * 9) / 5 + 32
  );
}
function convertToCelsius() {
  var temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(
    ((temperatureElement.innerHTML - 32) * 5) / 9
  );
}

//Feature: API City Temperature
function getCurrentDate(data) {
  const currentDate = new Date(data * 1000);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const time = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${dayOfWeek} ${time} `;
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
