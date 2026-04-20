import { test, expect } from '@playwright/test';

test('area of a circle with radius 5 equals 78.54 units²', async ({ page }) => {
  await page.goto('/');
  await page.fill('#circle-radius', '5');
  await page.click('.card:has(#circle-radius) button');
  await expect(page.locator('#circle-result')).toContainText('Result: 78.54 units²');
});

test('area of a rectangle with length 6 and width 4 equals 24.00 units²', async ({ page }) => {
  await page.goto('/');
  await page.fill('#rect-length', '6');
  await page.fill('#rect-width', '4');
  await page.click('.card:has(#rect-length) button');
  await expect(page.locator('#rectangle-result')).toContainText('Result: 24.00 units²');
});

test('area of a triangle with base 7 and height 7 equals 24.50 units²', async ({ page }) => {
  await page.goto('/');
  await page.fill('#tri-base', '7');
  await page.fill('#tri-height', '7');
  await page.click('.card:has(#tri-base) button');
  await expect(page.locator('#triangle-result')).toContainText('Result: 24.50 units²');
});

test('volume of a cylinder with radius 3 and height 5 equals 141.4 units³', async ({ page }) => {
  await page.goto('/');
  await page.fill('#cyl-radius', '3');
  await page.fill('#cyl-height', '5');
  await page.click('.card:has(#cyl-radius) button');
  await expect(page.locator('#cylinder-result')).toContainText('Result: 141.4 units³');
});
