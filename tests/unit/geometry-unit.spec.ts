import { test, expect } from '@playwright/test';
import { areaOfCircle, areaOfRectangle, volumeOfCylinder } from '../../calculator.js';

test.describe('areaOfCircle', () => {
  test('returns 0 for radius 0', () => {
    expect(areaOfCircle(0)).toBe(0);
  });

  test('returns correct area for radius 1', () => {
    expect(areaOfCircle(1)).toBeCloseTo(Math.PI, 9);
  });

  test('returns correct area for radius 5', () => {
    expect(areaOfCircle(5)).toBeCloseTo(78.5398, 4);
  });

  test('throws for negative radius', () => {
    expect(() => areaOfCircle(-1)).toThrow(RangeError);
  });
});

test.describe('areaOfRectangle', () => {
  test('returns 0 when either dimension is 0', () => {
    expect(areaOfRectangle(0, 5)).toBe(0);
  });

  test('returns correct area for whole numbers', () => {
    expect(areaOfRectangle(6, 4)).toBe(24);
  });

  test('returns correct area for decimals', () => {
    expect(areaOfRectangle(2.5, 4)).toBe(10);
  });

  test('throws for negative dimensions', () => {
    expect(() => areaOfRectangle(-1, 5)).toThrow(RangeError);
  });
});

test.describe('volumeOfCylinder', () => {
  test('returns 0 for radius 0', () => {
    expect(volumeOfCylinder(0, 10)).toBe(0);
  });

  test('returns correct volume for radius 1 height 1', () => {
    expect(volumeOfCylinder(1, 1)).toBeCloseTo(Math.PI, 9);
  });

  test('returns correct volume for radius 3 height 5', () => {
    expect(volumeOfCylinder(3, 5)).toBeCloseTo(141.3717, 4);
  });

  test('throws for negative dimensions', () => {
    expect(() => volumeOfCylinder(-1, 5)).toThrow(RangeError);
  });
});
