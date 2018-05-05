import Shape from './Shape';
import { rotatePoint } from './geom';

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
    const angle = -this.rotationInRadians;
    let { x, y } = this.pointToLocalSpace(point);
    x += this.pixelOrigin.x;
    y += this.pixelOrigin.y;

    if (x < 0) return false;
    if (y < 0) return false;
    if (x > width) return false;
    if (y > height) return false;

    return true;
  }
}
