import { test, expect } from '@playwright/test';

test('zip code 28075 resolves to Harrisburg, NC', async ({ page }) => {
  await page.route('https://api.zippopotam.us/us/28075', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        'post code': '28075',
        country: 'United States',
        'country abbreviation': 'US',
        places: [
          {
            'place name': 'Harrisburg',
            longitude: '-80.6551',
            state: 'North Carolina',
            'state abbreviation': 'NC',
            latitude: '35.3229',
          },
        ],
      }),
    })
  );

  await page.route('https://api.open-meteo.com/**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        current_weather: {
          temperature: 72,
          windspeed: 8,
          weathercode: 1,
        },
      }),
    })
  );

  await page.goto('/');

  await page.fill('#zip-input', '28075');
  await page.click('button:has-text("Get Weather")');

  await expect(page.locator('#weather-result')).toContainText('Harrisburg, NC');
});

test('zip code 90066 resolves to Los Angeles, CA', async ({ page }) => {
  await page.route('https://api.zippopotam.us/us/90066', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        'post code': '90066',
        country: 'United States',
        'country abbreviation': 'US',
        places: [
          {
            'place name': 'Los Angeles',
            longitude: '-118.4346',
            state: 'California',
            'state abbreviation': 'CA',
            latitude: '33.9842',
          },
        ],
      }),
    })
  );

  await page.route('https://api.open-meteo.com/**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        current_weather: {
          temperature: 68,
          windspeed: 5,
          weathercode: 0,
        },
      }),
    })
  );

  await page.goto('/');

  await page.fill('#zip-input', '90066');
  await page.click('button:has-text("Get Weather")');

  await expect(page.locator('#weather-result')).toContainText('Los Angeles, CA');
});

test('invalid zip code returns 404 and shows error message', async ({ page }) => {
  await page.route('https://api.zippopotam.us/us/99999', route =>
    route.fulfill({ status: 404 })
  );

  await page.goto('/');

  await page.fill('#zip-input', '99999');
  await page.click('button:has-text("Get Weather")');

  await expect(page.locator('#weather-result')).toContainText('ZIP code not found.');
});

test('weather api failure shows error message', async ({ page }) => {
  await page.route('https://api.zippopotam.us/us/28075', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        'post code': '28075',
        country: 'United States',
        'country abbreviation': 'US',
        places: [
          {
            'place name': 'Harrisburg',
            longitude: '-80.6551',
            state: 'North Carolina',
            'state abbreviation': 'NC',
            latitude: '35.3229',
          },
        ],
      }),
    })
  );

  await page.route('https://api.open-meteo.com/**', route =>
    route.fulfill({ status: 500 })
  );

  await page.goto('/');

  await page.fill('#zip-input', '28075');
  await page.click('button:has-text("Get Weather")');

  await expect(page.locator('#weather-result')).toContainText('Could not fetch weather.');
});
