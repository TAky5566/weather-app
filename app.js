import { fetchSearchData, fetchWeatherData } from "./apiFetch.js";
let searchFeild = document.getElementById("locationInput");
let searchView = document.getElementById("searchResults");

document.querySelectorAll(".info i").forEach((icon) => {
  const color = icon.dataset.color;
  if (color) icon.style.color = color;
});

searchFeild.addEventListener("input", async () => {
  let query = searchFeild.value;
  /* No Empty Query */
  if (query === "") {
    return;
  }

  let response = await fetchSearchData(query);

  if (response.length === 0) {
    let massage = document.createElement("p");
    massage.innerText = "No Data";
    searchView.innerText = "";
    searchView.append(massage);
  } else {
    searchView.innerText = "";

    response.forEach((element) => {
      let result = document.createElement("div");
      console.log(element);
      result.innerHTML = `
      <p class="result" data-id=${element.lat},${element.lon}>${element.name} | ${element.country}</p>
      `;
      /* add event listner to make this location weather details appear */
      result.addEventListener("click", (e) => {
        displayData(e.target.dataset.id);
      });
      searchView.append(result);
    });
  }
  /*
      country: "Egypt" 
    id: 680958
    lat: 30.47
    lon: 31.09
    name: "Abshish"
    region: "Al Minufiyah"
          */
});

async function displayData(query) {
  let response = await fetchWeatherData(query);
  console.log(response);

  let temperature = document.getElementById("currentTemp");
  let description = document.getElementById("CurrentWeatherState");
  let windSpeed = document.getElementById("wind");
  let cloud = document.getElementById("clouds");
  let humidity = document.getElementById("humidity");
  let minTemp = document.getElementById("minTemp");
  let maxTemp = document.getElementById("maxTemp");
  let sunrise = document.getElementById("sunrise");
  let sunset = document.getElementById("sunset");
  let country = document.getElementById("country");
  let currentDate = document.getElementById("currentDate");
  let CurrentWeatherIcon = document.getElementById("CurrentWeatherIcon");
  [
    temperature.innerText,
    description.innerText,
    windSpeed.innerText,
    humidity.innerText,
    cloud.innerText,
    maxTemp.innerText,
    minTemp.innerText,
    currentLocation.innerText,
    sunrise.innerText,
    sunset.innerText,
    country.innerText,
    currentDate.innerText,
    CurrentWeatherIcon.src,
  ] = [
    response.current.temp_c,
    response.current.condition.text,
    response.current.wind_kph + " km/h",
    response.forecast.forecastday[0].day.avghumidity + " %",
    response.forecast.forecastday[0].day.maxwind_kph + " %",
    response.forecast.forecastday[0].day.maxtemp_c + " °C",
    response.forecast.forecastday[0].day.mintemp_c + " °C",
    response.location.name,
    response.forecast.forecastday[0].astro.sunrise,
    response.forecast.forecastday[0].astro.sunset,
    response.location.country,
    formatDateTime(response.location.localtime, response.location.tz_id),
        response.forecast.forecastday[0].day.condition.icon,

  ];
}
const DateTime = luxon.DateTime;

/*luxon library */
function formatDateTime(dateString, tz) {
  return DateTime.fromSQL(dateString, { zone: tz }).toFormat(
    "HH:mm - EEEE, d LLL ‘yy"
  );
}



const alertDiv = document.getElementById("dstAlert");
const closeBtn = document.getElementById("closeAlert");

closeBtn.addEventListener("click", () => {
  alertDiv.style.display = "none";
});
