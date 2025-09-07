import { fetchWeatherData } from "./api.js";
import { RenderWeatherInfo } from "./ui.js";
import { getWeatherStyle } from "./condition.js";

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

export async function FetchAndSetUpData(long, latt) {
  let data = await cachedFetchSearch(
    `FetchWeather_${long},${latt}`,
    fetchWeatherData,
    5,
    long,
    latt
  );
  console.log(data);
  const {
    current: {
      temp_c,

      is_day,
      condition: { text, code },
      cloud,
    },
    forecast: {
      forecastday: [
        {
          astro: { sunrise, sunset },
          day: { avghumidity, maxwind_kph, maxtemp_c, mintemp_c },
        },
      ],
    },
    location: { name, country, localtime, tz_id },
  } = data;
  let {icon,color,background}=getWeatherStyle(code, is_day)
  return {
    temp_c,
    text,
    icon: {link:"./icons/" +icon + ".svg",color},
    cloud,
    avghumidity,
    maxwind_kph,
    maxtemp_c,
    mintemp_c,
    name,
    country,
    localtime,
    tz_id,
    sunrise: sunrise,
    sunset: sunset,
    background:background
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
