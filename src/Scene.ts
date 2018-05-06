import Shape from './Shape';
import Rectangle from './Rectangle';
import Handle from './Handle';
import * as geom from './geom';

export default class Scene {
  private canvas: HTMLCanvasElement;
  private shapes: Array<Shape> = [];
  private focusedShape?: Shape;
  private highlightedShape?: Shape;
  private rotateControl: Handle;
  private scaleControl: Handle;

  constructor(container?: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.rotateControl = new Handle({
      className: 'rotate-handle',
      callback: this.handleDragRotate,
    });
    this.scaleControl = new Handle({
      className: 'scale-handle',
      callback: this.handleDragScale,
    });
    this.hideHandles();
  }

  attachTo(container: HTMLElement) {
    this.addEventListeners();
    container.appendChild(this.canvas);
    this.rotateControl.attachTo(container);
    this.scaleControl.attachTo(container);

    this.updateSize();
  }

  remove() {
    this.removeEventListeners();

    const parent = this.canvas.parentNode;
    parent.removeChild(this.canvas);
    this.rotateControl.remove();
    this.scaleControl.remove();
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

  showHandles() {
    this.rotateControl.show();
    this.scaleControl.show();
  }

  hideHandles() {
    this.rotateControl.hide();
    this.scaleControl.hide();
  }

  showHandlesOnShape(shape: Shape) {
    if (!shape) {
      this.hideHandles();
      return;
    }

    const { width, height } = shape.size;
    let { x, y } = shape.position;
    // Move to top left of shape
    x -= shape.pixelOrigin.x;
    y -= shape.pixelOrigin.y;
    this.rotateControl.position = { x, y };

    x += width;
    y += height;
    this.scaleControl.position = { x, y };

    // Scale using bottom right
    this.showHandles();
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
    if (this.focusedShape) {
      // Update handle positions
      this.showHandlesOnShape(this.focusedShape);
    }
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
    this.showHandlesOnShape(this.focusedShape);
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

  handleDragRotate = (delta: Point) => {
  }

  handleDragScale = (delta: Point) => {
    const shape = this.focusedShape;
    if (!shape) return;

    shape.size.width += delta.x * 2;
    shape.size.height += delta.y * 2;

    // We only require uniform scaling, so use smallest axis
    const size = Math.min(shape.size.width, shape.size.height);
    shape.size.width = size;
    shape.size.height = size;

    this.render();
  }
}
