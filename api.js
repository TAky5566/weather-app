const apiKey = "99df12a35d094381a56201459252708";

let searchController = null;

export async function fetchSearchData(query) {
  if (searchController) searchController.abort();
  searchController = new AbortController();
  const signal = searchController.signal;

  try {
    let result = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`,
      { signal }
    );

    return result.json();
  } catch (err) {
    console.log(err);
  }
  return { length: 0 };
}
let weatherController = null;

export async function fetchWeatherData(lon, lat) {
  if (weatherController) weatherController.abort();
  weatherController = new AbortController();
  const signal = weatherController.signal;

  try {
    let result = fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=no`,
      { signal }
    );

    return (await result).json();
  } catch (err) {
    {
      console.log(err);
    }
  }
  return { length: 0 };
}
let sunInfoController = null;

export async function fetchSunInfo(lon, lat) {
  if (sunInfoController) sunInfoController.abort();
  sunInfoController = new AbortController();
  const signal = sunInfoController.signal;

  try {
    let result = fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&forecast_days=1`,
      { signal }
    );

    return (await result).json();
  } catch (err) {
    console.log(err);
  }
  return { length: 0 };
}

/********************/
