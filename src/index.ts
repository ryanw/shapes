import Scene from './Scene';
import Shape from './Shape';
import Rectangle from './Rectangle';

function main() {
  const scene = new Scene();
  scene.attachTo(document.querySelector('#application'));

  // TODO load from localStorage

  scene.addShape(new Rectangle({
    position: { x: 10, y: 10 },
    size: { width: 100, height: 200 },
    rotation: 45,
  }));
}

main();
