import { fetchSearchData, fetchWeatherData, fetchSunInfo } from "./apiFetch.js";
let searchFeild = document.getElementById("locationInput");
let searchView = document.getElementById("searchResults");

document.querySelectorAll(".info i").forEach((icon) => {
  const color = icon.dataset.color;
  if (color) icon.style.color = color;
});

searchFeild.addEventListener(
  "input",
  debounce(() => {
    let query = searchFeild.value.trim();
    /* No Empty Query */
    if (query.trim() === "") {
      return;
    }
    renderSearch(query);
  }, 500)
);

/*

*/
function debounce(func, time) {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
}

async function renderSearch(query) {
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
      <p class="result" data-lat="${element.lat}" data-lon="${element.lon}">${element.name} | ${element.country}</p>
      `;
      /* add event listner to make this location weather details appear */
      result.addEventListener("click", (e) => {
        displayData(e.target.dataset.lon , e.target.dataset.lat);
      });
      searchView.append(result);
    });
  }
}

async function displayData(long ,latt) {
  let response = await fetchWeatherData(long ,latt);
  const {
    current: {
      temp_c,
      condition: { text, icon },
      cloud,
    },
    forecast: {
      forecastday: [
        {
          day: { avghumidity, maxwind_kph, maxtemp_c, mintemp_c },
        },
      ],
    },
    location: { name, country, localtime, tz_id, },
  } = response;

  let sunInfo = await fetchSunInfo(long , latt);
  const {
    daily: { sunrise, sunset },
  } = sunInfo;

  updateWeatherInfo({
    temp_c,
    text,
    icon,
    cloud,
    avghumidity,
    maxwind_kph,
    maxtemp_c,
    mintemp_c,
    name,
    country,
    localtime,
    tz_id,
    sunrise: sunrise[0],
    sunset: sunset[0],
  });
}

function updateWeatherInfo(data) {
  const {
    temp_c,
    text,
    icon,
    cloud,
    avghumidity,
    maxwind_kph,
    maxtemp_c,
    mintemp_c,
    name,
    country,
    localtime,
    tz_id,
    sunrise,
    sunset,
  } = data;

  document.getElementById("currentTemp").innerText = temp_c;
  document.getElementById("CurrentWeatherState").innerText = text;
  document.getElementById("humidity").innerText = `${avghumidity} %`;
  document.getElementById("clouds").innerText = `${cloud} %`;
  document.getElementById("maxTemp").innerText = `${maxtemp_c} °C`;
  document.getElementById("minTemp").innerText = `${mintemp_c} °C`;
  document.getElementById("currentLocation").innerText = name;
  document.getElementById("country").innerText = country;
  document.getElementById("currentDate").innerText = formatDateTime(
    localtime,
    tz_id
  );
  document.getElementById("sunrise").innerText = setTimeZone(sunrise, tz_id);
  document.getElementById("sunset").innerText = setTimeZone(sunset, tz_id);
  document.getElementById("CurrentWeatherIcon").src = `https:${icon}`;
  document.getElementById("wind").innerText = `${maxwind_kph}`;
}

/*luxon library */
function formatDateTime(dateString, tz) {
  return luxon.DateTime.fromSQL(dateString, { zone: tz }).toFormat(
    "HH:mm - EEEE, d LLL ‘yy"
  );
}

function setTimeZone(time, timezone) {
  const Local = luxon.DateTime.fromISO(time, { zone: "UTC" })
    .setZone(timezone)
    .toFormat("HH:mm");
  return Local;
}

const alertDiv = document.getElementById("dstAlert");
const closeBtn = document.getElementById("closeAlert");
window.onload=()=>{
  if(!localStorage.getItem("AlertCase"))
    alertDiv.style.display = "block";
}
closeBtn.addEventListener("click", () => {
  alertDiv.style.display = "none";
  localStorage.setItem("AlertCase",1)
});
