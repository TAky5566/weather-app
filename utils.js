import { fetchWeatherData, fetchSunInfo } from "./api.js";
import { RenderWeatherInfo } from "./ui.js";

export function debounce(func, time) {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
}
export function handleSearchClick(func, limit) {
  let inThrottle = false;
  let lastlocation = { lat: null, lon: null };

  return async function (lon, lat) {
    if (
      !inThrottle &&
      !(lon === lastlocation.lon && lat === lastlocation.lat)
    ) {
      inThrottle = true;
      lastlocation = { lon, lat };
      setTimeout(() => {
        inThrottle = false;
        lastlocation = { lat: null, lon: null };
      }, limit);
      const data = await func(lon, lat);
      RenderWeatherInfo(data);
    }
  };
}
export function formatDateTime(dateString, tz) {
  return luxon.DateTime.fromSQL(dateString, { zone: tz }).toFormat(
    "HH:mm - EEEE, d LLL ‘yy"
  );
}

export function formatTimeInZone(time, timezone) {
  const Local = luxon.DateTime.fromISO(time, { zone: "UTC" })
    .setZone(timezone)
    .toFormat("HH:mm");
  return Local;
}

async function FetchData(long, latt) {
  let weatherData = await cachedFetchSearch(
    `FetchWeather_${long},${latt}`,
    fetchWeatherData,
    5,
    long,
    latt
  );
  let sunInfo = await cachedFetchSearch(
    `FetchSun_${long},${latt}`,
    fetchSunInfo,
    24 * 60,
    long,
    latt
  );

  return {
    weatherResponse: weatherData,
    sunResponse: sunInfo,
  };
}

export async function FetchAndSetUpData(long, latt) {
  const data = await FetchData(long, latt);
  
  const {
    weatherResponse: {
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
      location: { name, country, localtime, tz_id },
    },

    sunResponse: {
      daily: {
        sunrise: [SunRise],
        sunset: [SunSet],
      },
    },
  } = data;

  return {
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
    sunrise: SunRise,
    sunset: SunSet,
  };
}

export async function cachedFetchSearch(
  cacheKey,
  func,
  DelayMinutes,
  ...Query
) {
  const cached = getCached(cacheKey);

  if (cached) {
    return cached;
  }

  const fresh = await func(...Query);
  if (fresh && fresh.length !== 0)
    setCachingData(cacheKey, fresh, DelayMinutes * 60 * 1000);
  return fresh;
}

function setCachingData(key, data, etl) {
  const record = {
    value: data,
    expiry: Date.now() + etl,
  };
  localStorage.setItem(key, JSON.stringify(record));
}

function getCached(key) {
  const record = localStorage.getItem(key);
  if (!record) return null;

  const parsed = JSON.parse(record);
  if (Date.now() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.value;
}
