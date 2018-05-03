import Shape from './Shape';

export default class Rectangle extends Shape {
  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.size;

    ctx.fillStyle = '#009900';
    ctx.fillRect(0, 0, width, height);
  }
}
