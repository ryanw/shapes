# Shapes

## Overview

Shapes is written in TypeScript. This will validate the types of arguments
passed to any constructors or methods, ensuring at compile time that the
correct values are being used.

The root of the view is the `Scene` class. This handles adding and removing
shapes from the view, as well as manipulating the DOM.

Shapes all extend a base `Shape` class that implements the logic for
transforming shapes. This means subclasses don't need to worry how a shape is
rotated or positioned.


## Getting it running

We use webpack to build Shapes. To get things running simple do:

    npm install
    npm run serve

Then visit http://localhost:8080 to see it in action.

You can compile a production version by running

    npm run build

And finally to run the test suite:

    npm run test


## Implementation notes

### Scene

Before anything else you must first create a `Scene` and attach it to the DOM.

    const scene = new Scene();
    scene.attachTo(document.getElementById('#app'));

After this you can start adding shapes to your scene. Simply pass an instance
of your shape to the `addShape` method. All shapes need a `position` and a `size`.

    scene.addShape(new Star({
      position: { x: 200, y: 200 },
      size: { width: 100, height: 100 },
    }));

If you wish to do be notified when the scene changes you can pass an `onChange`
handler to the constructor. This will get called any time a shape is changed in
any way. The `Scene` also has a `toJSON` method which will serialise all the shapes
into JSON that can later be loaded back using the `Scene#importScene()` method.

    const scene = new Scene({
      onChange: () => {
        console.log("The scene has changed!", scene.toJSON());
      }
    });

### Shape

All shapes must extend from the `Shape` class. It is responsible for appling
the transform matrix to the canvas before drawing.

In a subclass you usually won't need to worry about how the shape is rotated or
positioned, but you will have to consider the width/height.

Drawing is done inside the `Shape#draw(ctx: CanvasRenderingContext2D)` method.
It receives the current 2D canvas context that you must use to draw your shape.

To achieve pixel perfect mouse hit detection you must also implement
`Shape#isPointInside(point: Point)` and return true if the point is inside the
shape. To aid you in doing this the base `Shape` class has a
`pointToLocalSpace(point: Point)` method which will transform a point on the
canvas into a point relative to the center of the unrotated shape.


## Room for improvement

The `Scene` class is quite large. It could be split into multiple smaller classes.
Possibly one to handle and the DOM manipulation, another to handle shape
management, and a few delegates to handle mouse events depending on the
current `Mode`.

The toolbar should have a proper class to handle its events. As it stands it
assumes that the HTML will contain the correct markup for it.

Most shapes could be replaced with a single `Polygon` shape and a list of vertices.

Scaling a shape to a negative size swaps the corners that the controls are on.

The code could probably do with more comments.
