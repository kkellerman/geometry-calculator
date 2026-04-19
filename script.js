import {
  areaOfCircle,
  areaOfRectangle,
  areaOfTriangle,
  volumeOfCylinder
} from "./calculator.js";

// ─── Geometry ─────────────────────────────────────────────────────────────────

function getNumber(id) {
  const val = parseFloat(document.getElementById(id).value);
  if (isNaN(val)) throw new TypeError("Please fill in all fields with valid numbers.");
  return val;
}

function showResult(id, value, unit) {
  const el = document.getElementById(id + "-result");
  el.classList.remove("error");
  el.textContent = `Result: ${value.toPrecision(4)} ${unit}`;
}

function showError(id, message) {
  const el = document.getElementById(id + "-result");
  el.classList.add("error");
  el.textContent = message;
}

export function calculate(shape) {
  try {
    switch (shape) {
      case "circle":    showResult("circle",    areaOfCircle(getNumber("circle-radius")),                           "units²"); break;
      case "rectangle": showResult("rectangle", areaOfRectangle(getNumber("rect-length"), getNumber("rect-width")), "units²"); break;
      case "triangle":  showResult("triangle",  areaOfTriangle(getNumber("tri-base"), getNumber("tri-height")),     "units²"); break;
      case "cylinder":  showResult("cylinder",  volumeOfCylinder(getNumber("cyl-radius"), getNumber("cyl-height")), "units³"); break;
    }
  } catch (err) {
    showError(shape, err.message);
  }
}

// ─── Weather ──────────────────────────────────────────────────────────────────

const WMO_CODES = {
  0: "Clear sky",        1: "Mainly clear",       2: "Partly cloudy",      3: "Overcast",
  45: "Foggy",           48: "Icy fog",
  51: "Light drizzle",   53: "Moderate drizzle",  55: "Dense drizzle",
  61: "Slight rain",     63: "Moderate rain",      65: "Heavy rain",
  71: "Slight snow",     73: "Moderate snow",      75: "Heavy snow",
  80: "Slight showers",  81: "Moderate showers",   82: "Violent showers",
  95: "Thunderstorm",    96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ heavy hail"
};

export async function getWeather() {
  const zip      = document.getElementById("zip-input").value.trim();
  const resultEl = document.getElementById("weather-result");

  resultEl.className   = "weather-result";
  resultEl.textContent = "Loading...";

  if (!/^\d{5}$/.test(zip)) {
    resultEl.classList.add("error");
    resultEl.textContent = "Enter a valid 5-digit ZIP.";
    return;
  }

  try {
    const geoRes = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!geoRes.ok) throw new Error("ZIP code not found.");
    const geoData  = await geoRes.json();
    const place    = geoData.places[0];
    const city     = place["place name"];
    const state    = place["state abbreviation"];
    const { latitude, longitude } = place;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`
    );
    if (!weatherRes.ok) throw new Error("Could not fetch weather.");
    const { current_weather } = await weatherRes.json();
    const { temperature, windspeed, weathercode } = current_weather;
    const condition = WMO_CODES[weathercode] ?? "Unknown";

    resultEl.innerHTML =
      `<span class="w-city">${city}, ${state}</span>` +
      `<span class="w-sep">|</span>` +
      `<span class="w-temp">${temperature}°F</span>` +
      `<span class="w-sep">|</span>` +
      `<span class="w-cond">${condition}</span>` +
      `<span class="w-sep">|</span>` +
      `<span class="w-wind">Wind ${windspeed} mph</span>`;
  } catch (err) {
    resultEl.classList.add("error");
    resultEl.textContent = err.message;
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

document.getElementById("zip-input").addEventListener("keydown", e => {
  if (e.key === "Enter") getWeather();
});

window.calculate   = calculate;
window.getWeather  = getWeather;
