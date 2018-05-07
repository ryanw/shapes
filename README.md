# Getting it running

We use webpack to build this application. To get things running simple do:

    npm install
    npm run serve

Then visit http://localhost:8080 to see it in action.

You can compile a production version by running

    npm run build

And finally to run the test suite:

    npm run test

# Overview

  The root of the view is the `Scene` class. This handles adding and removing
  shapes from the view, as well as manipulating the DOM.

  Shapes all extend a base `Shape` class that implements the logic for
  transforming shapes. This means subclasses to only need to worry about
  drawing themselves and hit detection.

# Implementation notes

  * Scene
    - Handles adding to the DOM
    - Attaching events
    - Keeping track of the Shapes in the document

  * Shape
    - Root class of all shapes in a Scene
    - Calculates transformation before drawing so other shapes don't need to thing about it
    - Subclasses should overrider `draw()` and `isPointInside()`

# Room for improvement

Scene class is quite large. It could be split into multiple smaller classes.
Possibly one to handle and the DOM manipulation, another to handle shape
management, and a few delegates to handle mouse events depending on the
current `Mode`.

The toolbar should have a proper class to handle its events. As it stands it
assumes that the HTML will contain the correct markup for it.

Most shapes could be replaced with a single `Polygon` shape and a list of vertices.

The code could probably do with more comments.
