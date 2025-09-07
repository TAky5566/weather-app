import {
  formatDateTime,
  handleSearchClick,
  FetchAndSetUpData,
  cachedFetchSearch,
} from "./utils.js";
import { fetchSearchData } from "./api.js";
let searchView = document.getElementById("searchResults");
let container = document.querySelector(".container")
const alertDiv = document.getElementById("dstAlert");
const closeBtn = document.getElementById("closeAlert");
window.onload = () => {
  if (!localStorage.getItem("AlertCase")) alertDiv.style.display = "block";
};
closeBtn.addEventListener("click", () => {
  alertDiv.style.display = "none";
  localStorage.setItem("AlertCase", 1);
});

export async function RenderWeatherInfo(data) {
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
    background
  } = data;

  document.getElementById("currentTemp").innerText = Math.round(temp_c) + "°";
  document.getElementById("CurrentWeatherState").innerText = text;
  document.getElementById("humidity").innerText = `${Math.round(
    avghumidity
  )} %`;
  document.getElementById("clouds").innerText = `${cloud} %`;
  document.getElementById("maxTemp").innerText = `${Math.round(maxtemp_c)} °C`;
  document.getElementById("minTemp").innerText = `${Math.round(mintemp_c)} °C`;
  document.getElementById("currentLocation").innerText = name + "," + country;
  document.getElementById("currentDate").innerText = formatDateTime(
    localtime,
    tz_id
  );
  document.getElementById("sunrise").innerText = sunrise;
  document.getElementById("sunset").innerText = sunset;
  let CurrentWeatherIcon= document.getElementById("CurrentWeatherIcon")
  
  CurrentWeatherIcon.src = icon.link;
  CurrentWeatherIcon.style.filter=`drop-shadow(2px 4px 6px ${icon.color}`;
container.style.backgroundImage=`url(img/${background})`
  document.getElementById("wind").innerText = `${Math.round(maxwind_kph)} km/h`;
}

export async function renderSearch(query) {
  let response = await cachedFetchSearch(
    `search_${query}`,
    fetchSearchData,
    5,
    query
  );

  if (response.length === 0) {
    let massage = document.createElement("p");
    massage.textContent = "No Data";
    searchView.innerText = "";
    searchView.append(massage);
  } else {
    searchView.innerText = "";
    const throttledDisplay = handleSearchClick(FetchAndSetUpData, 2000);

    response.forEach((element) => {
      let result = document.createElement("div");

      result.innerHTML = `
      <p class="result" data-lat="${element.lat}" data-lon="${element.lon}">${element.name} | ${element.country}</p>
      `;

      result.addEventListener("click", (e) => {
        const { lon, lat } = e.target.dataset;
        throttledDisplay(lon, lat);
      });
      searchView.append(result);
    });
  }
}
