# Geometry Calculator

A browser-based geometry calculator that computes areas and volumes for common shapes, with live weather lookup by ZIP code.

## Features

- **Area of a Circle** — given radius
- **Area of a Rectangle** — given length and width
- **Area of a Triangle** — given base and height
- **Volume of a Cylinder** — given radius and height
- **Weather Lookup** — current conditions by US ZIP code (via Zippopotam.us + Open-Meteo APIs)

All calculated values are displayed to 4 significant digits.

## Running the App

```bash
npm install
npx playwright install
npm run start
```

Then open [http://localhost:3000](http://localhost:3000).

## Tests

Tests are written with [Playwright](https://playwright.dev/) and organized into four categories:

### Unit — `tests/unit/`
Direct calls to the calculation functions in `calculator.js` with no browser involved. Covers happy paths, zero inputs, decimal inputs, and error throwing for negative values.

```bash
npx playwright test --project=Unit
```

### Integration — `tests/integration/`
Verifies that the full pipeline works together — DOM input → `script.js` → `calculator.js` → DOM output — for all four shapes in a real browser.

```bash
npx playwright test --project=Integration
```

### E2E — `tests/e2e/`
End-to-end user journey tests simulating real interactions across the app.

```bash
npx playwright test --project=E2E
```

### API — `tests/api/`
Tests the weather feature with mocked API responses, including success cases and error handling (404 ZIP, 500 weather service).

```bash
npx playwright test --project=API
```

### Run all tests

```bash
npx playwright test
```

### View the HTML report

```bash
npx playwright show-report
```
