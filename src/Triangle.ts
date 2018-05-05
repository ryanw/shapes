import Shape from './Shape';

export default class Triangle extends Shape {
  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.size;

    ctx.beginPath();
    ctx.fillStyle = '#990099';

    // Bottom left
    ctx.moveTo(0, height);
    // Top middle
    ctx.lineTo(width / 2, 0);
    // Bottom Right
    ctx.lineTo(width, height);
    // And back to bottom left
    ctx.lineTo(0, height);

    ctx.fill();

    if (this.highlighted || this.focused) {
      ctx.stroke();
    }
    ctx.closePath();
  }

  isPointInside(point: Point): boolean {
    return false;
  }
}
