export function isPointInsidePolygon(point: Point, polygon: Array<Point>): boolean {
  const { x, y } = point;

  let inside = false;
  for (let i = 0; i < polygon.length; i++) {
    // Line between current and previous point. First point connects to last point.
    const j = i === 0 ? polygon.length - 1 : i - 1;
    const { x: x1, y: y1 } = polygon[i];
    const { x: x2, y: y2 } = polygon[j];

    // Test if we intersect the line
    const intersects = (y1 > y) != (y2 > y) && (x < (x2 - x1) * (y - y1) / (y2 - y1) + x1);
    // Toggle whether we're inside or outside every time we hit a line
    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function rotatePoint(point: Point, pivot: Point, angle: number): Point {
  let { x, y } = point;
  x -= pivot.x;
  y -= pivot.y;
  const tx = x * Math.cos(angle) - y * Math.sin(angle) + pivot.x;
  const ty = x * Math.sin(angle) + y * Math.cos(angle) + pivot.y;

  return { x: tx, y: ty };
}

export function length(point: Point): number {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}

export function distance(a: Point, b: Point): number {
  return length({ x: a.x - b.x, y: a.y - b.y });
}

export function angleInTriangle(triangle: [Point, Point, Point], angleIndex: number) {
  if (angleIndex < 0 || angleIndex > 2) {
    throw new Error(`A triangle only has 3 points. You requested point ${angleIndex}`);
  }

  let p1, p2, p3;
  if (angleIndex === 0) {
    p1 = triangle[0];
    p2 = triangle[1];
    p3 = triangle[2];
  }
  else if (angleIndex === 1) {
    p1 = triangle[1];
    p2 = triangle[2];
    p3 = triangle[0];
  }
  else if (angleIndex === 2) {
    p1 = triangle[2];
    p2 = triangle[0];
    p3 = triangle[1];
  }

  // Length of sides
  const a = distance(p1, p2);
  const b = distance(p2, p3);
  const c = distance(p3, p1);

  let angle = Math.acos((b * b + c * c - a * a) / (2 * b * c));

  if (p2.y - p1.y > p2.x - p1.x) {
    angle = -angle;
  }

  return angle;
}
