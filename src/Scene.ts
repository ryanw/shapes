import Shape from './Shape';
import Rectangle from './Rectangle';

export default class Scene {
  private canvas: HTMLCanvasElement;
  private shapes: Array<Shape> = [];
  private focusedShape?: Shape;
  private highlightedShape?: Shape;

  constructor(container?: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
  }

  attachTo(container: HTMLElement) {
    this.addEventListeners();
    container.appendChild(this.canvas);
    this.updateSize();
  }

  remove() {
    this.removeEventListeners();
  }

  addEventListeners() {
    window.addEventListener('resize', this.handleResize);
    document.documentElement.addEventListener('mousemove', this.handleMouseMove);
    document.documentElement.addEventListener('mousedown', this.handleMouseDown);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove);
    document.documentElement.removeEventListener('mousedown', this.handleMouseDown);
  }

  updateSize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.render();
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
    this.render();
  }

  shapeAtPoint(x: number, y: number): Shape | null {
    return this.shapes.find(shape => shape.isPointInside({ x, y }));
  }

  render() {
    this.clear();
    const context = this.canvas.getContext('2d');
    this.shapes.forEach(shape => shape.render(context));
  }

  getShape(index: number): Shape | undefined {
    return this.shapes[index];
  }

  highlightShape(shape: Shape | null) {
    if (shape === this.highlightedShape) {
      return;
    }

    // Remove highlight from old shape
    if (this.highlightedShape) {
      this.highlightedShape.highlighted = false;
    }

    // Highlight new shape
    if (shape) {
      shape.highlighted = true;
    }
    this.highlightedShape = shape;
    this.render();
  }

  focusShape(shape: Shape | null) {
    if (shape === this.focusedShape) {
      return;
    }

    // Remove focus from old shape
    if (this.focusedShape) {
      this.focusedShape.focused = false;
    }

    // focus new shape
    if (shape) {
      shape.focused = true;
    }
    this.focusedShape = shape;
    this.render();
  }

  clear() {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handleResize = (ev: Event) => {
    this.updateSize();
  }

  handleMouseMove = (ev: MouseEvent) => {
    const { clientX: x, clientY: y } = ev;
    this.highlightShape(this.shapeAtPoint(x, y));
  }

  handleMouseDown = (ev: MouseEvent) => {
    const { clientX: x, clientY: y } = ev;
    this.focusShape(this.shapeAtPoint(x, y));
  }
}
