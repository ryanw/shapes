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
    position: { x: 576, y: 176 },
    size: { width: 350, height: 150 },
  }));

  scene.addShape(new Star({
    position: { x: 176, y: 176 },
    radius: 75,
    points: 5,
  }));

  scene.addShape(new Circle({
    position: { x: 75, y: 475 },
    radius: 75,
  }));

  scene.addShape(new Triangle({
    position: { x: 700, y: 700 },
    size: { width: 150, height: 450 },
  }));


  let i = 1;
  setInterval(() => {
    let shape;

    shape = scene.getShape(0);
    shape.rotation += 1;

    shape = scene.getShape(1);
    shape.rotation += Math.sin(i) * 3;

    shape = scene.getShape(3);
    shape.rotation += Math.abs(Math.sin(i)) * 5;

    scene.render();
    i += 0.1;
  }, 1000 / 60);
}

main();
