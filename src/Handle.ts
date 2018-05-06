export interface HandleProps {
  className?: string;
}

export default class Handle {
  private _position: Point;
  el: HTMLElement;

  constructor(props: HandleProps = {}) {
    this.el = document.createElement('div');
    this.el.className = `handle ${props.className || ''}`;
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
    container.appendChild(this.el);
  }

  remove() {
    this.el.parentNode.removeChild(this.el);
  }

  show() {
    this.el.style.display = 'block';
  }

  hide() {
    this.el.style.display = 'none';
  }
}
