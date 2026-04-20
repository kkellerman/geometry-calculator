import {
  areaOfCircle,
  areaOfRectangle,
  areaOfTriangle,
  volumeOfCylinder
} from "./calculator.js";

// ─── Tiny test runner ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const results = [];

function test(description, fn) {
  try {
    fn();
    passed++;
    results.push({ ok: true, description });
  } catch (err) {
    failed++;
    results.push({ ok: false, description, error: err.message });
  }
}

function assertEqual(actual, expected, tolerance = 1e-9) {
  if (typeof expected === "number") {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  } else {
    if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

function assertThrows(fn, expectedType) {
  try {
    fn();
    throw new Error("Expected an error to be thrown, but none was.");
  } catch (err) {
    if (err instanceof expectedType === false) {
      throw new Error(`Expected ${expectedType.name}, got ${err.constructor.name}: ${err.message}`);
    }
  }
}

// ─── Area of Circle ──────────────────────────────────────────────────────────

test("areaOfCircle: radius 0 returns 0", () => {
  assertEqual(areaOfCircle(0), 0);
});

test("areaOfCircle: radius 1 returns π", () => {
  assertEqual(areaOfCircle(1), Math.PI);
});

test("areaOfCircle: radius 5 returns 78.5398...", () => {
  assertEqual(areaOfCircle(5), Math.PI * 25);
});

test("areaOfCircle: radius 2.5 returns π * 6.25", () => {
  assertEqual(areaOfCircle(2.5), Math.PI * 6.25);
});

test("areaOfCircle: negative radius throws RangeError", () => {
  assertThrows(() => areaOfCircle(-1), RangeError);
});

// ─── Area of Rectangle ───────────────────────────────────────────────────────

test("areaOfRectangle: 0 × 0 returns 0", () => {
  assertEqual(areaOfRectangle(0, 0), 0);
});

test("areaOfRectangle: 4 × 5 returns 20", () => {
  assertEqual(areaOfRectangle(4, 5), 20);
});

test("areaOfRectangle: 7 × 3 returns 21", () => {
  assertEqual(areaOfRectangle(7, 3), 21);
});

test("areaOfRectangle: 2.5 × 4 returns 10", () => {
  assertEqual(areaOfRectangle(2.5, 4), 10);
});

test("areaOfRectangle: negative length throws RangeError", () => {
  assertThrows(() => areaOfRectangle(-1, 5), RangeError);
});

test("areaOfRectangle: negative width throws RangeError", () => {
  assertThrows(() => areaOfRectangle(5, -1), RangeError);
});

// ─── Area of Triangle ────────────────────────────────────────────────────────

test("areaOfTriangle: base 0 returns 0", () => {
  assertEqual(areaOfTriangle(0, 10), 0);
});

test("areaOfTriangle: base 6, height 4 returns 12", () => {
  assertEqual(areaOfTriangle(6, 4), 12);
});

test("areaOfTriangle: base 10, height 5 returns 25", () => {
  assertEqual(areaOfTriangle(10, 5), 25);
});

test("areaOfTriangle: base 3.5, height 2 returns 3.5", () => {
  assertEqual(areaOfTriangle(3.5, 2), 3.5);
});

test("areaOfTriangle: negative base throws RangeError", () => {
  assertThrows(() => areaOfTriangle(-3, 4), RangeError);
});

test("areaOfTriangle: negative height throws RangeError", () => {
  assertThrows(() => areaOfTriangle(3, -4), RangeError);
});

// ─── Volume of Cylinder ──────────────────────────────────────────────────────

test("volumeOfCylinder: radius 0 returns 0", () => {
  assertEqual(volumeOfCylinder(0, 10), 0);
});

test("volumeOfCylinder: radius 1, height 1 returns π", () => {
  assertEqual(volumeOfCylinder(1, 1), Math.PI);
});

test("volumeOfCylinder: radius 3, height 5 returns 45π", () => {
  assertEqual(volumeOfCylinder(3, 5), Math.PI * 45);
});

test("volumeOfCylinder: radius 2, height 7 returns 28π", () => {
  assertEqual(volumeOfCylinder(2, 7), Math.PI * 28);
});

test("volumeOfCylinder: negative radius throws RangeError", () => {
  assertThrows(() => volumeOfCylinder(-1, 5), RangeError);
});

test("volumeOfCylinder: negative height throws RangeError", () => {
  assertThrows(() => volumeOfCylinder(5, -1), RangeError);
});

// ─── Report ──────────────────────────────────────────────────────────────────

export { results, passed, failed };

// ─── API Tests ───────────────────────────────────────────────────────────────

function assertHasKeys(obj, keys) {
  for (const key of keys) {
    if (!(key in obj)) throw new Error(`Missing key: "${key}"`);
  }
}

async function apiTest(description, fn) {
  try {
    await fn();
    return { ok: true, description };
  } catch (err) {
    return { ok: false, description, error: err.message };
  }
}

export async function runApiTests() {
  const GEO_URL    = "https://api.zippopotam.us/us";
  const METEO_URL  = "https://api.open-meteo.com/v1/forecast";
  const METEO_OPTS = "current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph";

  return Promise.all([

    // ── Zippopotam ────────────────────────────────────────────────────────

    apiTest("Zippopotam: known ZIP (90210) responds with HTTP 200", async () => {
      const res = await fetch(`${GEO_URL}/90210`);
      if (!res.ok) throw new Error(`Expected 200, got ${res.status}`);
    }),

    apiTest("Zippopotam: response contains places array", async () => {
      const res  = await fetch(`${GEO_URL}/90210`);
      const data = await res.json();
      assertHasKeys(data, ["places"]);
      if (!Array.isArray(data.places) || data.places.length === 0)
        throw new Error("places is empty or not an array");
    }),

    apiTest("Zippopotam: place has name, latitude, longitude, state abbreviation", async () => {
      const res   = await fetch(`${GEO_URL}/90210`);
      const data  = await res.json();
      assertHasKeys(data.places[0], ["place name", "latitude", "longitude", "state abbreviation"]);
    }),

    apiTest("Zippopotam: latitude and longitude are numeric strings", async () => {
      const res   = await fetch(`${GEO_URL}/90210`);
      const data  = await res.json();
      const { latitude, longitude } = data.places[0];
      if (isNaN(parseFloat(latitude)))  throw new Error(`latitude "${latitude}" is not numeric`);
      if (isNaN(parseFloat(longitude))) throw new Error(`longitude "${longitude}" is not numeric`);
    }),

    apiTest("Zippopotam: invalid ZIP (00000) returns HTTP 404", async () => {
      const res = await fetch(`${GEO_URL}/00000`);
      if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    }),

    // ── Open-Meteo ────────────────────────────────────────────────────────

    apiTest("Open-Meteo: valid coordinates respond with HTTP 200", async () => {
      const res = await fetch(`${METEO_URL}?latitude=34.09&longitude=-118.41&${METEO_OPTS}`);
      if (!res.ok) throw new Error(`Expected 200, got ${res.status}`);
    }),

    apiTest("Open-Meteo: response contains current_weather object", async () => {
      const res  = await fetch(`${METEO_URL}?latitude=34.09&longitude=-118.41&${METEO_OPTS}`);
      const data = await res.json();
      assertHasKeys(data, ["current_weather"]);
      if (typeof data.current_weather !== "object") throw new Error("current_weather is not an object");
    }),

    apiTest("Open-Meteo: current_weather has temperature, windspeed, weathercode", async () => {
      const res  = await fetch(`${METEO_URL}?latitude=34.09&longitude=-118.41&${METEO_OPTS}`);
      const data = await res.json();
      assertHasKeys(data.current_weather, ["temperature", "windspeed", "weathercode"]);
    }),

    apiTest("Open-Meteo: temperature is a finite number", async () => {
      const res  = await fetch(`${METEO_URL}?latitude=40.71&longitude=-74.01&${METEO_OPTS}`);
      const data = await res.json();
      const temp = data.current_weather.temperature;
      if (typeof temp !== "number" || !isFinite(temp))
        throw new Error(`Expected finite number, got ${JSON.stringify(temp)}`);
    }),

    apiTest("Open-Meteo: windspeed is a non-negative number", async () => {
      const res  = await fetch(`${METEO_URL}?latitude=40.71&longitude=-74.01&${METEO_OPTS}`);
      const data = await res.json();
      const wind = data.current_weather.windspeed;
      if (typeof wind !== "number" || wind < 0)
        throw new Error(`Expected non-negative number, got ${JSON.stringify(wind)}`);
    }),

  ]);
}
