import * as geom from './geom';

describe('geom.rotatePoint', () => {
  it("should rotate a point 90 degrees clockwise", () => {
    const angle = -90;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(200, 5);
    expect(y).toBeCloseTo(-100, 5);
  });

  it("should rotate a point 90 degrees anticlockwise", () => {
    const angle = 90;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(-200, 5);
    expect(y).toBeCloseTo(100, 5);
  });

  it("should rotate a point 45 degrees clockwise", () => {
    const angle = -45;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(212.13203, 5);
    expect(y).toBeCloseTo(70.71068, 5);
  });

  it("should rotate a point 45 degrees anticlockwise", () => {
    const angle = 45;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(-70.71068, 5);
    expect(y).toBeCloseTo(212.13203, 5);
  });

  it("should rotate a point 180 degrees clockwise", () => {
    const angle = -180;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(-100, 5);
    expect(y).toBeCloseTo(-200, 5);
  });

  it("should rotate a point 180 degrees anticlockwise", () => {
    const angle = 180;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(-100, 5);
    expect(y).toBeCloseTo(-200, 5);
  });

  it("should rotate a point 122 degrees clockwise", () => {
    const angle = -122;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(116.61769, 5);
    expect(y).toBeCloseTo(-190.78866, 5);
  });

  it("should rotate a point 122 degrees anticlockwise", () => {
    const angle = 122;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(-222.60155, 5);
    expect(y).toBeCloseTo(-21.179043, 5);
  });

  it("should rotate a point 13 degrees clockwise", () => {
    const angle = -13;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(142.42722, 5);
    expect(y).toBeCloseTo(172.37891, 5);
  });

  it("should rotate a point 13 degrees anticlockwise", () => {
    const angle = 13;
    const point: Point = { x: 100, y: 200 };
    const { x, y } = geom.rotatePoint(point, { x: 0, y: 0 }, angle * Math.PI / 180);

    // Test approximate angle
    expect(x).toBeCloseTo(52.44680, 5);
    expect(y).toBeCloseTo(217.36912, 5);
  });
});

describe('geom.isPointInsidePolygon', () => {
  it("detects a point at center of a triangle", () => {
    const point = { x: 0.5, y: 0.5 };

    const triangle = [
      { x: 0,   y: 0 },
      { x: 0.5, y: 1 },
      { x: 1,   y: 0 },
    ];

    const hit = geom.isPointInsidePolygon(point, triangle);
    expect(hit).toBe(true);
  });

  it("detects a point outside of a triangle", () => {
    const point = { x: 0.8, y: 0.8 };

    const triangle = [
      { x: 0,   y: 0 },
      { x: 0.5, y: 1 },
      { x: 1,   y: 0 },
    ];

    const hit = geom.isPointInsidePolygon(point, triangle);
    expect(hit).toBe(false);
  });

  it("detects a point inside of a concave polygon", () => {
    // Shape: |\/\/|
    //        |____|
    const polygon = [
      { x: 0,   y: 0 },
      { x: 0,   y: 2 },
      { x: 1,   y: 1 },
      { x: 2,   y: 2 },
      { x: 3,   y: 1 },
      { x: 4,   y: 2 },
      { x: 4,   y: 0 },
    ];

    let hit;

    // Test all 3 spikes

    // Left
    hit = geom.isPointInsidePolygon({ x: 0.4, y: 1.5 }, polygon);
    expect(hit).toBe(true);

    // Middle
    hit = geom.isPointInsidePolygon({ x: 2.1, y: 1.7 }, polygon);
    expect(hit).toBe(true);

    // Right
    hit = geom.isPointInsidePolygon({ x: 3.9, y: 1.9 }, polygon);
    expect(hit).toBe(true);
  });

  it("detects a point outside of a concave polygon", () => {
    // Shape: |\/\/|
    //        |____|
    const polygon = [
      { x: 0,   y: 0 },
      { x: 0,   y: 2 },
      { x: 1,   y: 1 },
      { x: 2,   y: 2 },
      { x: 3,   y: 1 },
      { x: 4,   y: 2 },
      { x: 4,   y: 0 },
    ];

    let hit;

    // Test both indents

    // Left
    hit = geom.isPointInsidePolygon({ x: 0.6, y: 1.5 }, polygon);
    expect(hit).toBe(false);

    // Right
    hit = geom.isPointInsidePolygon({ x: 3.1, y: 1.9 }, polygon);
    expect(hit).toBe(false);
  });
});

describe('geom.length', () => {
  it('returns the correct length', () => {
    const vector = { x: 4, y: 3 };
    const length = geom.length(vector);
    expect(length).toBe(5);
  });
});

describe('geom.distance', () => {
  it('returns the correct distance', () => {
    const point1 = { x: 2, y: 3 };
    const point2 = { x: 12, y: 5 };
    const length = geom.distance(point1, point2);
    expect(length).toBeCloseTo(10.198, 3);
  });
});

describe('geom.angleInTriangle', () => {
  it ('returns the correct angle for each point', () => {
    const triangle: [Point, Point, Point] = [
      { x: 3, y: 3 },
      { x: 6, y: 6 },
      { x: 7, y: 4 },
    ]

    expect(geom.angleInTriangle(triangle, 0)).toBeCloseTo(1.35, 2);
    expect(geom.angleInTriangle(triangle, 1)).toBeCloseTo(0.54, 2);
    expect(geom.angleInTriangle(triangle, 2)).toBeCloseTo(-1.25, 2);
  });
});
