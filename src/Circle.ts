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
      size: { width: radius, height: radius },
      position: props.position,

      // You can't rotate a circle
      rotation: 0,
    });

    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = '#000099';
    ctx.arc(this.radius, this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
