export type DragCallback = (delta: Point) => void;
export interface HandleProps {
  className?: string;
  callback?: DragCallback;
}

export default class Handle {
  private _position: Point;
  private _prevMousePoint?: Point;
  dragCallback?: DragCallback;
  el: HTMLElement;

  constructor(props: HandleProps = {}) {
    this.el = document.createElement('div');
    this.el.className = `handle ${props.className || ''}`;
    this.dragCallback = props.callback;
    this.position = { x: 0, y: 0 };
  }

  get position(): Point {
    // Return a copy
    return { ...this._position };
  }

  set position(point: Point) {
    this._position = { ...point };
    this.el.style.left = point.x + 'px';
    this.el.style.top = point.y + 'px';
  }

  attachTo(container: HTMLElement) {
    this.addEventListeners();
    container.appendChild(this.el);
  }

  remove() {
    this.removeEventListeners();
    this.el.parentNode.removeChild(this.el);
  }

  addEventListeners() {
    this.el.addEventListener('mousedown', this.handleMouseDown);
  }

  removeEventListeners() {
    this.el.removeEventListener('mousedown', this.handleMouseDown);
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove);
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp);
  }

  show() {
    this.el.style.display = 'block';
  }

  hide() {
    this.el.style.display = 'none';
  }

  handleMouseDown = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    document.documentElement.addEventListener('mousemove', this.handleMouseMove);
    document.documentElement.addEventListener('mouseup', this.handleMouseUp);

    this._prevMousePoint = { x: ev.clientX, y: ev.clientY };
  }

  handleMouseMove = (ev: MouseEvent) => {
    const delta = {
      x: ev.clientX - this._prevMousePoint.x,
      y: ev.clientY - this._prevMousePoint.y,
    }
    if (this.dragCallback) {
      this.dragCallback(delta);
    }


    this._prevMousePoint = { x: ev.clientX, y: ev.clientY };
  }

  handleMouseUp = (ev: MouseEvent) => {
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove);
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp);

    this._prevMousePoint = null;
  }
}
