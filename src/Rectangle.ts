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
    if (width === 0 || height === 0) {
      return false;
    }

    let { x, y } = this.pointToLocalSpace(point);
    x += this.pixelOrigin.x;
    y += this.pixelOrigin.y;

    if (width > 0 && x < 0) return false;
    if (width < 0 && x < width) return false;

    if (height > 0 && y < 0) return false;
    if (height < 0 && y < height) return false;

    if (width > 0 && x > width) return false;
    if (width < 0 && x > 0) return false;

    if (height > 0 && y > height) return false;
    if (height < 0 && y > 0) return false;

    return true;
  }
}
