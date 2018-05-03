import Shape from './Shape';
import Rectangle from './Rectangle';

export default class Scene {
  private canvas: HTMLCanvasElement;
  private shapes: Shape[] = [];

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
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.handleResize);
  }

  updateSize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
    this.redraw();
  }

  redraw() {
    this.clear();
    const context = this.canvas.getContext('2d');

    if (!context) {
      throw new Error("Unable to get 2D Context");
    }

    this.shapes.forEach(shape => shape.draw(context));
  }

  clear() {
    //TODO
  }

  handleResize = (ev: Event) => {
    this.updateSize();
  }
}
