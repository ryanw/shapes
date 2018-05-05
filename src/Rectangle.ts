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
    const { x, y } = this.position;
    const angle = -this.rotationInRadians;
    let { x: px, y: py } = point;

    // Transform the point so it matches the shape
    px -= x;
    py -= y;
    const tx = px * Math.cos(angle) - py * Math.sin(angle) + this.pixelOrigin.x + x;
    const ty = px * Math.sin(angle) + py * Math.cos(angle) + this.pixelOrigin.y + y;

    // Simple rectangle test
    if (tx < x) return false;
    if (ty < y) return false;
    if (tx > x + width) return false;
    if (ty > y + height) return false;

    return true;
  }
}
