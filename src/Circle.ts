import Shape from './Shape';

export interface CircleProperties {
  position?: Point;
  radius?: number;
}


export default class Circle extends Shape {
  constructor(props: CircleProperties = {}) {
    super({
      size: { width: props.radius * 2, height: props.radius * 2 },
      position: props.position,

      // You can't rotate a circle
      rotation: 0,
    });
  }

  get radius(): number {
    return this.size.width / 2;
  }

  set radius(r: number) {
    this.size.width = r * 2;
    this.size.height = r * 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = '#00aaff';
    ctx.arc(this.radius, this.radius, Math.abs(this.radius), 0, Math.PI * 2);
    ctx.fill();
    if (this.highlighted || this.focused) {
      ctx.stroke();
    }
    ctx.closePath();
  }

  isPointInside(point: Point): boolean {
    let { x, y } = this.pointToLocalSpace(point);
    x -= this.radius - this.pixelOrigin.x;
    y -= this.radius - this.pixelOrigin.y;

    const length = Math.sqrt(x * x + y * y);
    return length < this.radius;
  }
}
