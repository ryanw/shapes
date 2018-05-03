export interface ShapeProperties {
  position?: Point;
  size?: Size;
  rotation?: Degrees;
}

/**
 * Base class for all shapes rendered in a Scene
 */
export default class Shape {
  private position: Point;
  private size: Size;
  private rotation: Degrees;

  constructor(props: ShapeProperties = {}) {
    // Provide defaults when props values are empty
    this.position = { x: 0, y: 0, ...props.position };
    this.size = { width: 100, height: 100, ...props.size };
    this.rotation = props.rotation || 0.0;
  }

  draw(ctx: CanvasRenderingContext2D) {
  }
}
