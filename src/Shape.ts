export interface ShapeProperties {
  position?: Point;
  size?: Size;
  rotation?: Degrees;
}

/**
 * Base class for all shapes rendered in a Scene
 */
export default class Shape {
  public position: Point;
  public size: Size;
  public rotation: Degrees;
  protected origin: Point = { x: 0.5, y: 0.5 };

  constructor(props: ShapeProperties = {}) {
    // Provide defaults when props values are empty
    this.position = { x: 0, y: 0, ...props.position };
    this.size = { width: 100, height: 100, ...props.size };
    this.rotation = props.rotation || 0.0;
  }

  // Renders the shape to a canvas.
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.applyTransform(ctx);
    this.draw(ctx);
    ctx.restore();
  }

  // Draw the shape to the canvas. Override in the subclass to implement the custom drawing code.
  // The position and rotation transform are applied automatically before this method is called.
  draw(ctx: CanvasRenderingContext2D) {
  }

  private applyTransform(ctx: CanvasRenderingContext2D) {
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
  }

  // Test if a given coordinate is inside the shape
  isPointInside(point: Point): boolean {
    return false;
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
