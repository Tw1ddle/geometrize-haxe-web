[![Project logo](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/logo.png?raw=true "Geometrize Haxe Project logo")](https://www.geometrize.co.uk/)

[![License](https://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/LICENSE)
[![Geometrize Haxe Web Build Status](https://ci.appveyor.com/api/projects/status/github/Tw1ddle/geometrize-haxe-web)](https://ci.appveyor.com/project/Tw1ddle/geometrize-haxe-web)

Web demo for [Geometrize](https://www.geometrize.co.uk/), a tool for recreating images as geometric primitives. Run it now [in your browser](https://www.samcodes.co.uk/project/geometrize-haxe-web/).

Made using the [Geometrize Haxe](https://github.com/Tw1ddle/geometrize-haxe) library, a [Haxe](https://haxe.org/) port of [primitive](https://github.com/fogleman/primitive).

[![Geometrized Cat 500 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/cat.gif?raw=true "Geometrized Cat - 500 Geometric Primitives")](https://www.geometrize.co.uk/)

## Features
* Recreate images as geometric primitives - rectangles, triangles, circles, ellipses and lines are supported.
* Interactive options for adjusting shape types, shape and background opacity, speed and accuracy.
* Save geometrized images as raster PNGs, vector SVGs or as JSON data.
* Watch the geometrized images being generated in realtime.

## Shape Comparison

The matrix shows results for circles, triangles, rotated rectangles, rotated ellipses and all supported shapes at 50, 200 and 500 total shapes:

| -                  | 50 Shapes     | 200 Shapes    | 500 Shapes   |
| ------------------ | ------------- | ------------- | ------------ |
| Circles            | [![50 Circles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_circles.png?raw=true)](https://www.geometrize.co.uk/) | [![200 Circles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_200_circles.png?raw=true)](https://www.geometrize.co.uk/) | [![500 Circles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_circles.png?raw=true)](https://www.geometrize.co.uk/) |
| Triangles          | [![50 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_triangles.png?raw=true)](https://www.geometrize.co.uk/) | [![200 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_200_triangles.png?raw=true)](https://www.geometrize.co.uk/) | [![500 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_triangles.png?raw=true)](https://www.geometrize.co.uk/) |
| Rotated Rectangles | [![50 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_rotated_rectangles.png?raw=true)](https://www.geometrize.co.uk/) | [![200 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_200_rotated_rectangles.png?raw=true)](https://www.geometrize.co.uk/) | [![500 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_rotated_rectangles.png?raw=true)](https://www.geometrize.co.uk/) |
| Rotated Ellipses   | [![50 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_rotated_ellipses.png?raw=true)](https://www.geometrize.co.uk/) | [![200 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_200_rotated_ellipses.png?raw=true)](https://www.geometrize.co.uk/) | [![500 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_rotated_ellipses.png?raw=true)](https://www.geometrize.co.uk/) |
| All Shapes         | [![50 All Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_all_shapes.png?raw=true)](https://www.geometrize.co.uk/) | [![200 All Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_200_all_shapes.png?raw=true)](https://www.geometrize.co.uk/) | [![500 All Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_all_shapes.png?raw=true)](https://www.geometrize.co.uk/) |

## Usage

* Open up the [demo](https://www.samcodes.co.uk/project/geometrize-haxe-web/) and watch the default geometrized seagull gradually take form.
* Pick your own image via "Open Image", and click on the "Settings" button to reveal various different shape and iteration settings.
* Once you are happy with the results, hit one of the "Save" buttons to save a copy of the geometrized image.

## Examples And Screenshots

Geometrized public domain [artwork](https://commons.wikimedia.org/wiki/Category:Paintings_by_painter) and [photos](https://www.pexels.com/public-domain-images/):

[![Geometrized Train 230 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe/blob/master/screenshots/train.png?raw=true "Train - 230 Rotated Ellipses")](https://www.geometrize.co.uk/)
[![Geometrized Flower - 330 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/flower.png?raw=true "Flower - 330 Rotated Ellipses")](https://www.geometrize.co.uk/)
[![Geometrized Woodland Cemetery - 600 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/woodland_cemetery.png?raw=true "Woodland Cemetery - 600 Rotated Rectangles")](https://www.geometrize.co.uk/)
[![Geometrized Pomegranate - 300 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/pomegranate.png?raw=true "Pomegranate - 300 Rotated Ellipses")](https://www.geometrize.co.uk/)
[![Geometrized Tree Under Clouds 210 Ellipses](https://github.com/Tw1ddle/geometrize-haxe/blob/master/screenshots/tree_under_clouds.png?raw=true "Tree Under Clouds - 210 Ellipses")](https://www.geometrize.co.uk/)
[![Geometrized Monarch Butterfly - 800 Various Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/monarch_butterfly.png?raw=true "Monarch Butterfly - 800 Various Shapes")](https://www.geometrize.co.uk/)
[![Geometrized Chomsky - 300 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/chomsky.png?raw=true "Noam Chomsky - 300 Triangles")](https://www.geometrize.co.uk/)
[![Geometrized Trees 250 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe/blob/master/screenshots/trees.png?raw=true "Trees - 250 Rotated Ellipses")](https://www.geometrize.co.uk/)

For more examples, see the Geometrize [gallery](https://gallery.geometrize.co.uk/).

## Notes
* Got an idea or suggestion? Open an issue on GitHub, or send Sam a message on [Twitter](https://twitter.com/Sam_Twidale).
* The Geometrize Haxe library is available as a [haxelib](https://lib.haxe.org/p/geometrize-haxe).
* Find more code related to Geometrize [here](https://resources.geometrize.co.uk/).