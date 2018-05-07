import Shape, { ShapeProperties } from './Shape';
import Rectangle from './Rectangle';
import Circle from './Circle';
import Triangle from './Triangle';
import Star from './Star';
import Handle, { HandleEvent } from './Handle';
import * as geom from './geom';

export type ShapeName = 'Rectangle' | 'Circle' | 'Triangle' | 'Star';

const SHAPE_MAP: { [key: string]: typeof Shape } = {
  'Rectangle': Rectangle,
  'Circle': Circle,
  'Triangle': Triangle,
  'Star': Star,
}

export enum Mode {
  Select,
  Create,
  Scale,
  Rotate,
  Move,
}

export interface ShapeRecord {
  shape: ShapeName;
  props: ShapeProperties;
}

export interface SceneProperties {
  onChange?: () => void;
}

export default class Scene {
  private mode: Mode = Mode.Select;
  private canvas: HTMLCanvasElement;
  private shapes: Array<Shape> = [];
  private focusedShape?: Shape;
  private highlightedShape?: Shape;
  private startMousePoint?: Point;
  private prevMousePoint?: Point;
  private rotateControl: Handle;
  private scaleControl: Handle;
  private startSize: Size;
  private startRotation: Degrees;
  private shapeConstructor: typeof Shape = Rectangle;
  private onChangeCallback?: () => void;

  public uniformScaling: boolean = true;

  constructor(props: SceneProperties = {}) {
    this.onChangeCallback = props.onChange;
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

  importScene(shapes: Array<ShapeRecord>) {
    this.shapes = shapes.map((record: ShapeRecord): Shape => {
      const shapeConstructor: typeof Shape = SHAPE_MAP[record.shape];
      if (!shapeConstructor) {
        throw new Error(`Unable to find constructor for ${record.shape}`);
      }

      return new shapeConstructor(record.props);
    });

    this.render();
  }

  toJSON(): string {
    const records = this.shapes.map((shape: Shape): ShapeRecord => {
      let name: ShapeName;
      for (let key in SHAPE_MAP) {
        if (shape instanceof SHAPE_MAP[key]) {
          name = key as ShapeName;
          break;
        }
      }

      if (!name) {
        throw new Error(`Unable to serialize shape`);
      }

      const record: ShapeRecord = {
        shape: name,
        props: {
          position: shape.position,
          size: shape.size,
          rotation: shape.rotation,
        }
      }

      return record;
    });

    return JSON.stringify(records);
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
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    document.documentElement.addEventListener('mousemove', this.handleMouseMove);
    document.documentElement.addEventListener('mouseup', this.handleMouseUp);

    const toolbar = document.querySelector('.toolbar');
    toolbar.querySelector('.select-button').addEventListener('click', this.handleClickSelect);
    toolbar.querySelector('.circle-button').addEventListener('click', this.handleClickCircle);
    toolbar.querySelector('.square-button').addEventListener('click', this.handleClickSquare);
    toolbar.querySelector('.triangle-button').addEventListener('click', this.handleClickTriangle);
    toolbar.querySelector('.star-button').addEventListener('click', this.handleClickStar);
    toolbar.querySelector('.delete-button').addEventListener('click', this.handleClickDelete);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove);
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp);
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

  removeShape(shape: Shape) {
    const idx = this.shapes.indexOf(shape);
    if (idx > -1) {
      this.shapes.splice(idx, 1);
    }
    if (this.focusedShape === shape) {
      this.focusShape(null);
    }
  }

  shapeAtPoint(x: number, y: number): Shape | null {
    // Reverse search becuase top most shape is last in the array
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      if (shape.isPointInside({ x, y })) {
        return shape;
      }
    }

    // Not found
    return null;
  }

  change() {
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }

  render() {
    this.clear();
    this.drawMode();
    const context = this.canvas.getContext('2d');
    this.shapes.forEach(shape => shape.render(context));
    if (this.focusedShape) {
      // Update handle positions
      this.showHandlesOnShape(this.focusedShape);
    }
    this.change();
  }

  drawMode() {
    let label = 'Mode: ';

    if (this.mode === Mode.Create) {
      label += 'Create a ';

      for (let key in SHAPE_MAP) {
        if (this.shapeConstructor === SHAPE_MAP[key]) {
          label += key;
          break;
        }
      }
    }
    else {
      label += 'Edit';
    }

    const context = this.canvas.getContext('2d');
    context.font = '32px sans-serif';
    context.fillStyle = 'white';
    context.fillText(label, 10, 50);
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

  beginRotation() {
    const shape = this.focusedShape;
    if (!shape) return;
    this.startRotation = shape.rotationInRadians;
  }

  updateRotation(start: Point, end: Point) {
    const shape = this.focusedShape;
    if (!shape) return;

    // Find the angle we've dragged

    // Make a triangle from pivot, start mouse position, and current mouse position.
    const pa = shape.position;
    const pb = start;
    const pc = end;

    const angle = geom.angleInTriangle([pa, pb, pc], 1);
    shape.rotationInRadians = this.startRotation + angle;

    this.render();
  }

  stopRotation() {
    this.mode = Mode.Select;
  }

  beginScaling() {
    this.mode = Mode.Scale;
    const shape = this.focusedShape;
    if (!shape) return;
    this.startSize = { ...shape.size };
  }

  updateScale(delta: Point) {
    if (this.mode !== Mode.Scale) {
      return;
    }

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

  stopScaling() {
    this.mode = Mode.Select;
    this.startSize = null;
  }

  handleResize = (ev: Event) => {
    this.updateSize();
  }

  handleMouseDown = (ev: MouseEvent) => {
    const { clientX: x, clientY: y } = ev;

    switch (this.mode) {
      case Mode.Select:
        this.focusShape(this.shapeAtPoint(x, y));
        this.mode = Mode.Move;
        break;

      case Mode.Create:
        // Create a new shape
        const shape = new this.shapeConstructor({
          position: { x, y },
          size: { width: 10, height: 10 }
        });
        this.addShape(shape);
        this.focusShape(shape);
        this.beginScaling();
        break;
    }

    this.startMousePoint = { x, y };
    this.prevMousePoint = { x, y };
  }


  handleMouseMove = (ev: MouseEvent) => {
    const { clientX: x, clientY: y } = ev;

    switch (this.mode) {
      case Mode.Select:
        this.highlightShape(this.shapeAtPoint(x, y));
        break;

      case Mode.Move:
        if (this.focusedShape) {
          ev.preventDefault();
          // FIXME put in a moveShape() method
          const delta = { x: x - this.prevMousePoint.x, y: y - this.prevMousePoint.y };
          this.focusedShape.position.x += delta.x;
          this.focusedShape.position.y += delta.y;
          this.render();
        }

      case Mode.Scale:
        ev.preventDefault();
        this.updateScale({ x: x - this.startMousePoint.x, y: y - this.startMousePoint.y });
        break;
        // TODO
    }

    this.prevMousePoint = { x, y };
  }

  handleMouseUp = (ev: MouseEvent) => {
    switch (this.mode) {
      case Mode.Scale:
        this.stopScaling();
        break;

      case Mode.Move:
        this.mode = Mode.Select;
    }
  }

  handleStartRotate = (ev: HandleEvent) => {
    this.beginRotation();
  }

  handleDragRotate = (ev: HandleEvent) => {
    const { delta, mouseX, mouseY } = ev;
    if (!delta) return;

    this.updateRotation({ x: mouseX - delta.x, y: mouseY - delta.y }, { x: mouseX, y: mouseY });
  }

  handleEndRotate = (ev: HandleEvent) => {
    this.stopRotation();
  }

  handleStartScale = (ev: HandleEvent) => {
    this.beginScaling();
  }

  handleDragScale = (ev: HandleEvent) => {
    const { delta } = ev;
    if (!delta) return;

    this.updateScale(delta);
  }

  handleEndScale = (ev: HandleEvent) => {
    this.stopScaling();
  }

  // Toolbar events
  handleClickSelect = (ev: Event) => {
    this.mode = Mode.Select;
    this.focusShape(null);
    this.render();
  }

  handleClickCircle = (ev: Event) => {
    this.mode = Mode.Create;
    this.shapeConstructor = Circle;
    this.focusShape(null);
    this.render();
  }

  handleClickSquare = (ev: Event) => {
    this.mode = Mode.Create;
    this.shapeConstructor = Rectangle;
    this.focusShape(null);
    this.render();
  }

  handleClickTriangle = (ev: Event) => {
    this.mode = Mode.Create;
    this.shapeConstructor = Triangle;
    this.focusShape(null);
    this.render();
  }

  handleClickStar = (ev: Event) => {
    this.mode = Mode.Create;
    this.shapeConstructor = Star;
    this.focusShape(null);
    this.render();
  }

  handleClickDelete = (ev: Event) => {
    if (!this.focusedShape) {
      return;
    }
    this.removeShape(this.focusedShape);
    this.mode = Mode.Select;
    this.focusShape(null);
    this.render();
  }

}
