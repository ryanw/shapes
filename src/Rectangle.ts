import Shape from './Shape';

export default class Rectangle extends Shape {
  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.size;

    ctx.fillStyle = '#ff9900';
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
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
