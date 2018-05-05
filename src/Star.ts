import Shape from './Shape';

export interface StarProperties {
  position?: Point;
  radius?: number;
  rotation?: Degrees;
  points?: number;
}

export default class Star extends Shape {
  protected pointCount: number;
  protected radius: number;

  constructor(props: StarProperties = {}) {
    const radius = props.radius || 100;
    super({
      size: { width: radius, height: radius },
      position: props.position,
      rotation: props.rotation,
    });

    this.radius = radius;
    this.pointCount = props.points || 5;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.size;
    const { radius, pointCount } = this;
    const innerRadius = radius / 2;

    ctx.translate(innerRadius, innerRadius);

    // Draw our pretty star
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    for (let i = 0; i < pointCount; i++){
      ctx.rotate(Math.PI / pointCount);
      ctx.lineTo(0, -innerRadius);
      ctx.rotate(Math.PI / pointCount);
      ctx.lineTo(0, -radius);
    }
    ctx.closePath();
    ctx.fillStyle = '#bb0000';
    ctx.fill();
    if (this.highlighted || this.focused) {
      ctx.stroke();
    }
  }
}
