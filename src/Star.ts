import Shape from './Shape';
import { rotatePoint, isPointInsidePolygon } from './geom';

export interface StarProperties {
  position?: Point;
  radius?: number;
  rotation?: Degrees;
  points?: number;
}

export default class Star extends Shape {
  protected pointCount: number;

  constructor(props: StarProperties = {}) {
    super({
      size: { width: props.radius * 2, height: props.radius * 2 },
      position: props.position,
      rotation: props.rotation,
    });

    this.pointCount = props.points || 5;
  }

  get radius(): number {
    return this.size.width / 2;
  }

  set radius(r: number) {
    this.size.width = r * 2;
    this.size.height = r * 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { radius, innerRadius, pointCount } = this;

    ctx.translate(radius, radius);

    // Draw our pretty star
    ctx.beginPath();
    const poly = this.asPolygon();
    ctx.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) {
      const point = poly[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.fillStyle = '#ffff00';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -radius);
    for (let i = 0; i < pointCount; i++){
      ctx.rotate(Math.PI / pointCount);
      ctx.lineTo(0, -innerRadius);
      ctx.rotate(Math.PI / pointCount);
      ctx.lineTo(0, -radius);
    }
    ctx.closePath();

    if (this.highlighted || this.focused) {
      ctx.stroke();
    }
  }

  asPolygon(): Array<Point> {
    const { width, height } = this.size;
    const { radius, innerRadius, pointCount } = this;
    const center = { x: 0, y: 0 };

    const polygon: Array<Point> = [];
    let outerPoint = { x: 0, y: -radius };
    let innerPoint = rotatePoint({ x: 0, y: -innerRadius }, center, Math.PI / pointCount);
    polygon.push(outerPoint);
    polygon.push(innerPoint);
    for (let i = 0; i < pointCount; i++){
      outerPoint = rotatePoint(outerPoint, center, Math.PI / pointCount * 2);
      innerPoint = rotatePoint(innerPoint, center, Math.PI / pointCount * 2);
      polygon.push(outerPoint);
      polygon.push(innerPoint);
    }

    return polygon;
  }

  isPointInside(point: Point): boolean {
    const x = this.pointToLocalSpace(point);
    return isPointInsidePolygon(this.pointToLocalSpace(point), this.asPolygon());
  }

  get innerRadius(): number {
    return this.radius / 2.5;
  }
}
