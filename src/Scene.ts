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
    this.render();
  }

  render() {
    const context = this.canvas.getContext('2d');

    if (!context) {
      throw new Error("Unable to get 2D Context");
    }

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.forEach(shape => shape.render(context));
  }

  getShape(index: number): Shape | undefined {
    return this.shapes[index];
  }

  clear() {
    //TODO
  }

  handleResize = (ev: Event) => {
    this.updateSize();
  }
}
