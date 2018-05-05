import Scene from './Scene';
import Shape from './Shape';
import Rectangle from './Rectangle';
import Star from './Star';
import Circle from './Circle';
import Triangle from './Triangle';

function main() {
  const scene = new Scene();
  scene.attachTo(document.querySelector('#application'));

  // TODO load from localStorage

  scene.addShape(new Rectangle({
    position: { x: 0, y: 0 },
    size: { width: 250, height: 150 },
  }));

  scene.addShape(new Star({
    position: { x: 500, y: 200 },
    radius: 75,
  }));

  scene.addShape(new Circle({
    position: { x: 300, y: 400 },
    radius: 75,
  }));

  scene.addShape(new Triangle({
    position: { x: 700, y: 700 },
    size: { width: 150, height: 250 },
  }));

  let i = 1;
  setInterval(() => {
    let shape;

    shape = scene.getShape(0);
    shape.rotation += 1

    shape = scene.getShape(1);
    shape.rotation += Math.sin(i) * 3;

    shape = scene.getShape(3);
    shape.rotation += Math.abs(Math.sin(i));

    scene.render();
    i += 0.1;
  }, 10);
}

main();
