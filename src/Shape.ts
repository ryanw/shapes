export interface ShapeProperties {
  position?: Point;
  size?: Size;
  rotation?: Degrees;
}

/**
 * Base class for all shapes rendered in a Scene
 */
export default class Shape {
  protected position: Point;
  protected size: Size;
  protected rotation: Degrees;
  protected origin: Point = { x: 0.5, y: 0.5 };

  constructor(props: ShapeProperties = {}) {
    // Provide defaults when props values are empty
    this.position = { x: 0, y: 0, ...props.position };
    this.size = { width: 100, height: 100, ...props.size };
    this.rotation = props.rotation || 0.0;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    let { x, y } = this.position;
    const { width, height } = this.size;
    const { x: originX, y: originY } = this.pixelOrigin;

    // Position relative to the origin rather than top/left
    x -= originX;
    y -= originY;

    // Move shape to where we're going to draw it
    ctx.translate(x, y);

    // Offset to rotate around the origin of the shape
    ctx.translate(originX, originY);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.translate(-originX, -originY);

    this.draw(ctx);

    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D) {
  }

  setRotation(rotation: Degrees) {
    this.rotation = rotation;
  }

  getRotation(): Degrees {
    return this.rotation;
  }

  // Returns the pixel offset of the origin point
  get pixelOrigin(): Point {
    const { width, height } = this.size;

    return {
      x: width * this.origin.x,
      y: height * this.origin.y,
    };
  }
}
