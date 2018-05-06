import Scene, { ShapeRecord } from './Scene';
import Shape from './Shape';
import Rectangle from './Rectangle';
import Star from './Star';
import Circle from './Circle';
import Triangle from './Triangle';

const DEFAULT_SCENE: Array<ShapeRecord> = [
  {
    shape: 'Rectangle',
    props: {
      position: { x: 576, y: 176 },
      size: { width: 150, height: 150 },
    },
  },
  {
    shape: 'Star',
    props: {
      position: { x: 176, y: 176 },
      size: { width: 75, height: 75 },
    },
  },
  {
    shape: 'Circle',
    props: {
      position: { x: 75, y: 475 },
      size: { width: 75, height: 75 },
    },
  },
  {
    shape: 'Triangle',
    props: {
      position: { x: 700, y: 500 },
      size: { width: 250, height: 250 },
    },
  },
];

function main() {
  const scene = new Scene({
    onChange: () => {
      localStorage.setItem('scene', scene.toJSON());
    }
  });

  const savedScene = localStorage.getItem('scene');
  if (savedScene) {
    scene.importScene(JSON.parse(savedScene));
  }
  else {
    scene.importScene(DEFAULT_SCENE);
  }

  scene.attachTo(document.querySelector('#application'));
}

main();
