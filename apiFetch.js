let apiKey = "99df12a35d094381a56201459252708";

let controllerForSearch = null;

async function fetchSearchData(query) {
  if (controllerForSearch) controllerForSearch.abort();
  controllerForSearch = new AbortController();
  const signal = controllerForSearch.signal;

  try {
    let result = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`,
      { signal }
    );
    return result.json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Another Query have been inputed");
    } else {
      console.error(err);
    }
    return [];
  }
}
let controllerForWeatherData = null;

async function fetchWeatherData(lon, lat) {
  if (controllerForWeatherData) controllerForWeatherData.abort();
  controllerForWeatherData = new AbortController();
  const signal = controllerForWeatherData.signal;

  try {
    let result = fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=no`,
      { signal }
    );
    return (await result).json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Another Query have been inputed");
    } else {
      console.error(err);
    }
    return [];
  }
}
let controllerForSunInfo = null;

async function fetchSunInfo(lon, lat) {
  if (controllerForSunInfo) controllerForSunInfo.abort();
  controllerForSunInfo = new AbortController();
  const signal = controllerForSunInfo.signal;

  try {
    let result = fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&forecast_days=1`,
      { signal }
    );
    return (await result).json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Another Query have been inputed");
    } else {
      console.error(err);
    }
    return [];
  }
}
export { fetchSearchData, fetchWeatherData, fetchSunInfo };
