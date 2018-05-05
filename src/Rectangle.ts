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
    const { width, height } = this.size;
    let { x, y } = this.position;
    x -= this.pixelOrigin.x;
    y -= this.pixelOrigin.y;


    if (point.x < x) return false;
    if (point.y < y) return false;
    if (point.x > x + width) return false;
    if (point.y > y + height) return false;

    return true;
  }
}
