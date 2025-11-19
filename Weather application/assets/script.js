const API_KEY = "8451a83c436e2bbf22d11cbe6a9e1235"; // Replace with your key

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) {
      alert("City not found!");
      return;
    }

    // Current weather
    document.getElementById("cityName").innerText = weatherData.name;
    document.getElementById("temperature").innerText =
      Math.round(weatherData.main.temp) + "°C";
    document.getElementById("description").innerText =
      weatherData.weather[0].description;
    document.getElementById("humidity").innerText =
      weatherData.main.humidity + "%";

    const windKmH = Math.round(weatherData.wind.speed * 3.6);
    document.getElementById("wind").innerText = windKmH + " km/h";

    const rainValue = weatherData.rain ? weatherData.rain["1h"] || 0 : 0;
    document.getElementById("rain").innerText = rainValue + " mm";

    // Forecast
    const forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";

    const daily = forecastData.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    daily.slice(1, 7).forEach((day) => {
      const date = new Date(day.dt_txt);
      const icon = day.weather[0].icon;
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].main;
      const rain = day.rain ? day.rain["3h"] : 0;

      const dayHTML = `
        <div class="forecast-day">
          <p>${date.toLocaleDateString("en-US", { weekday: "short" })}</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" />
          <p>${temp}°C</p>
          <p><i class="bi bi-cloud-rain"></i> ${rain || 0}mm</p>
        </div>
      `;
      forecastEl.insertAdjacentHTML("beforeend", dayHTML);
    });
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Failed to fetch weather data. Check your API key or network.");
  }
}

// ---- Initialize page ----
document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const searchBtn = document.getElementById("searchBtn");

  // Default city: Bhubaneswar
  cityInput.value = "Bhubaneswar";
  getWeather();

  // Search button click
  searchBtn.addEventListener("click", getWeather);

  // Enter key triggers search
  cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // prevent reload
      getWeather();
    }
  });
});
