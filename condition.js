// Grouping codes from WeatherAPI
const weatherGroups = {
  clear: [1000],
  partlyCloudy: [1003, 1006, 1009],
  mist: [1030, 1135, 1147],
  drizzle: [1150, 1153, 1168, 1171],
  rain: [
    1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246,
  ],
  sleet: [1069, 1204, 1207, 1249, 1252, 1255, 1258, 1261, 1264],
  snow: [
    1066, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1279, 1282,
  ],
  thunder: [1087, 1273, 1276],
};

const weatherStyles = {
  clear: {
    dayIcon: "day-clear",
    nightIcon: "night-clear",
    Background: {
      day: "clear-day.jpg",
      night: "clear-night.jpg",
    },
    Color: "#FFD700",
  },

  partlyCloudy: {
    dayIcon: "day-partlyCloudy",
    nightIcon: "night-partlyCloudy",
    Background: {
      day: "cloudy.jpg",
      night: "night-cloudy.jpg",
    },
    Color: "#B0C4DE",
  },
  cloudy: {
    dayIcon: "clouds",
    nightIcon: "clouds",
    Background: {
      day: "cloudy.jpg",
      night: "night-cloudy.jpg",
    },
    Color: "#B0C4DE",
  },
  mist: {
    dayIcon: "day-mist",
    nightIcon: "night-mist",
    Background: {
      day: "mist.jpg",
      night: "mist.jpg",
    },
    Color: "#C0C0C0",
  },
  drizzle: {
    dayIcon: "day-drizzle",
    nightIcon: "night-drizzle",
    Background: {
      day: "rain.jpg",
      night: "rain.jpg",
    },
    Color: "#87CEFA",
  },
  rain: {
    dayIcon: "day-rain",
    nightIcon: "night-rain",
    Background: {
      day: "rain.jpg",
      night: "rain.jpg",
    },
    Color: "#00BFFF",
  },
  sleet: {
    dayIcon: "day-sleet",
    nightIcon: "night-sleet",
    Background: {
      day: "snow.jpg",
      night: "snow.jpg",
    },
    Color: "#ADD8E6",
  },
  snow: {
    dayIcon: "day-snow",
    nightIcon: "night-snow",
    Background: {
      day: "snow.jpg",
      night: "snow.jpg",
    },
    Color: "#E0FFFF",
  },
  shower: {
    dayIcon: "day-shower",
    nightIcon: "night-shower",
    Background: {
      day: "rain.jpg",
      night: "rain.jpg",
    },
    Color: "#4682B4",
  },
  thunder: {
    dayIcon: "day-thunder",
    nightIcon: "night-thunder",
    Background: {
      day: "thunderstorm.jpg",
      night: "thunderstorm.jpg",
    },
    Color: "#FFA500",
  },
};

// Function to get the style by code + day/night
export function getWeatherStyle(code, isDay) {
  let group = Object.keys(weatherGroups).find((key) =>
    weatherGroups[key].includes(code)
  );

  if (!group) return null;

  const style = weatherStyles[group];
  
  return {
    icon: isDay ? style.dayIcon : style.nightIcon,
    color: style.Color,
    background: isDay ?style.Background.day : style.Background.night,
  };
}
