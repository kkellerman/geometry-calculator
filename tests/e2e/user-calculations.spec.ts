import { test, expect } from '@playwright/test';

test('area of a circle with radius 5 equals 78.54 units²', async ({ page }) => {
  await page.goto('/');
  await page.fill('#circle-radius', '5');
  await page.click('button:has-text("Calculate")');
  await expect(page.locator('#circle-result')).toHaveText('Result: 78.54 units²');
});


test('area of a Rectangle with length 6 and width 6 equals 36.00 units²', async ({ page }) => {
  await page.goto('/');

  await page.fill('#rect-length', '6');
  await page.fill('#rect-width', '6');
  await page.click('.card:has(#rect-length) button');

  await expect(page.locator('#rectangle-result')).toHaveText('Result: 36.00 units²');
});


test('area of a triangle with base 7 and height 7 equals 24.50 units²', async ({ page }) => {
  await page.goto('/');
  await page.fill('#tri-base', '7');
  await page.fill('#tri-height', '7');
  await page.click('.card:has(#tri-base) button');
  await expect(page.locator('#triangle-result')).toContainText('Result: 24.50 units²');
});