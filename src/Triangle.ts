import Shape from './Shape';
import { isPointInsidePolygon } from './geom';

export default class Triangle extends Shape {
  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.size;

    ctx.beginPath();
    ctx.fillStyle = '#990099';

    // Bottom left
    ctx.moveTo(0, height);
    // Top middle
    ctx.lineTo(width / 2, 0);
    // Bottom right
    ctx.lineTo(width, height);
    // And back to bottom left
    ctx.lineTo(0, height);

    ctx.fill();

    if (this.highlighted || this.focused) {
      ctx.stroke();
    }
    ctx.closePath();
  }

  asPolygon(): Array<Point> {
    const { width, height } = this.size;

    const polygon = [
      // Bottom left
      { x: 0, y: height },
      // Top middle
      { x: width / 2, y: 0 },
      // Bottom right
      { x: width, y: height },
      // And back
      { x: 0, y: height },
    ];

    const offset = this.pixelOrigin;
    polygon.forEach(point => {
      point.x -= offset.x;
      point.y -= offset.y;
    });

    return polygon;
  }

  isPointInside(point: Point): boolean {
    return isPointInsidePolygon(this.pointToLocalSpace(point), this.asPolygon());
  }
}
