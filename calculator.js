export function areaOfCircle(radius) {
  if (radius < 0) throw new RangeError("Radius must be non-negative");
  return Math.PI * radius * radius;
}

export function areaOfRectangle(length, width) {
  if (length < 0 || width < 0) throw new RangeError("Dimensions must be non-negative");
  return length * width;
}

export function areaOfTriangle(base, height) {
  if (base < 0 || height < 0) throw new RangeError("Dimensions must be non-negative");
  return 0.5 * base * height;
}

export function volumeOfCylinder(radius, height) {
  if (radius < 0 || height < 0) throw new RangeError("Dimensions must be non-negative");
  return Math.PI * radius * radius * height;
}
