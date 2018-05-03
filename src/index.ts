import Scene from './Scene';
import Shape from './Shape';
import Rectangle from './Rectangle';
import Star from './Star';

function main() {
  const scene = new Scene();
  scene.attachTo(document.querySelector('#application'));

  // TODO load from localStorage

  scene.addShape(new Rectangle({
    position: { x: 100, y: 200 },
    size: { width: 150, height: 150 },
    rotation: 0,
  }));

  scene.addShape(new Star({
    position: { x: 100, y: 200 },
    radius: 75,
    rotation: 0,
    points: 6,
  }));

  setInterval(() => {
    let shape;

    shape = scene.getShape(0);
    shape.setRotation(shape.getRotation() + 1);

    shape = scene.getShape(1);
    shape.setRotation(shape.getRotation() - 1);

    scene.render();
  }, 10);
}

main();
