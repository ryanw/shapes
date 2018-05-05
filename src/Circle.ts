import Shape from './Shape';

export interface CircleProperties {
  position?: Point;
  radius?: number;
}


export default class Circle extends Shape {
  protected radius: number;

  constructor(props: CircleProperties = {}) {
    const radius = props.radius || 100;
    super({
      size: { width: radius * 2, height: radius * 2 },
      position: props.position,

      // You can't rotate a circle
      rotation: 0,
    });

    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = '#00aaff';
    ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
    if (this.highlighted || this.focused) {
      ctx.stroke();
    }
    ctx.closePath();
  }

  isPointInside(point: Point): boolean {
    let { x, y } = this.position;
    x -= point.x;
    y -= point.y;

    const length = Math.sqrt(x * x + y * y);
    return length < this.radius;
  }
}
