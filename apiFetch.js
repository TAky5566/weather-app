let apiKey = "99df12a35d094381a56201459252708";

let controller = null;

async function fetchSearchData(query) {
  if (controller) controller.abort();
  controller = new AbortController();
  const signal = controller.signal;

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
async function fetchWeatherData(query) {
  if (controller) controller.abort();
  controller = new AbortController();
  const signal = controller.signal;

  try {
    let result = fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=5&aqi=no&alerts=no`,
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

export { fetchSearchData, fetchWeatherData };
