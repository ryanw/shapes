import Shape from './Shape';
import Rectangle from './Rectangle';
import Handle, { HandleEvent } from './Handle';
import * as geom from './geom';

export default class Scene {
  private canvas: HTMLCanvasElement;
  private shapes: Array<Shape> = [];
  private focusedShape?: Shape;
  private highlightedShape?: Shape;
  private rotateControl: Handle;
  private scaleControl: Handle;
  private startSize: Size;
  private startRotation: Degrees;

  public uniformScaling: boolean = true;

  constructor(container?: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.rotateControl = new Handle({
      className: 'rotate-handle',
      onStart: this.handleStartRotate,
      onDrag: this.handleDragRotate,
      onEnd: this.handleEndRotate,
    });
    this.scaleControl = new Handle({
      className: 'scale-handle',
      onStart: this.handleStartScale,
      onDrag: this.handleDragScale,
      onEnd: this.handleEndScale,
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

  handleStartRotate = (ev: HandleEvent) => {
    const shape = this.focusedShape;
    if (!shape) return;
    this.startRotation = shape.rotationInRadians;
  }

  handleDragRotate = (ev: HandleEvent) => {
    const { delta, mouseX, mouseY } = ev;
    if (!delta) return;

    const shape = this.focusedShape;
    if (!shape) return;

    // Find the angle we've dragged

    // Make a triangle from pivot, start mouse position, and current mouse position.
    const pa = shape.position;
    const pb = { x: mouseX - delta.x, y: mouseY - delta.y };
    const pc = { x: mouseX, y: mouseY };

    // Length of sides
    const a = geom.distance(pa, pb);
    const b = geom.distance(pb, pc);
    const c = geom.distance(pc, pa);

    // Angle opposite point 'b'
    let angle = Math.acos((c * c + a * a - b * b) / (2 * c * a));
    if (delta.y > delta.x) {
      angle = -angle;
    }
    shape.rotationInRadians = this.startRotation + angle;

    this.render();
  }

  handleEndRotate = (ev: HandleEvent) => {
  }

  handleStartScale = (ev: HandleEvent) => {
    const shape = this.focusedShape;
    if (!shape) return;
    this.startSize = { ...shape.size };
  }

  handleDragScale = (ev: HandleEvent) => {
    const { delta } = ev;
    if (!delta) return;

    const shape = this.focusedShape;
    if (!shape) return;

    shape.size.width = this.startSize.width + delta.x * 2;
    shape.size.height = this.startSize.height + delta.y * 2;

    // If we only require uniform scaling use the smallest axis;
    if (this.uniformScaling) {
      const size = Math.min(shape.size.width, shape.size.height);
      shape.size.width = size;
      shape.size.height = size;
    }

    this.render();
  }

  handleEndScale = (ev: HandleEvent) => {
  }
}
