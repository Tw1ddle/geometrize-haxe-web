[![Project logo](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/logo.png?raw=true "Geometrize Haxe Project logo")](http://www.geometrize.co.uk/)

[![Build Status](https://img.shields.io/travis/Tw1ddle/geometrize-haxe-web.svg?style=flat-square)](https://travis-ci.org/Tw1ddle/geometrize-haxe-web)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/LICENSE)

Web demo for [Geometrize](http://www.geometrize.co.uk/), a tool for recreating images as geometric primitives. Run it now [in your browser](http://www.samcodes.co.uk/project/geometrize-haxe-web/).

Made using the [Geometrize Haxe](https://github.com/Tw1ddle/geometrize-haxe) library, a [Haxe](https://haxe.org/) port of [primitive](https://github.com/fogleman/primitive).

[![Geometrized Train 230 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe/blob/master/screenshots/train.png?raw=true "Train - 230 Rotated Ellipses")](http://www.geometrize.co.uk/)

## Features
* Recreate images as geometric primitives - rectangles, triangles, circles, ellipses and lines are supported.
* Modify interactive options for adjusting shape types, shape opacity, speed and accuracy.
* Watch the geometrized images being generated in realtime.
* Save geometrized images as raster PNGs or vector SVGs.

## Usage

* Open up the [demo](http://www.samcodes.co.uk/project/geometrize-haxe-web/) and watch the default geometrized seagull gradually take form.
* Pick your own image via "Open Image", and click on the "Settings" button to reveal various different shape and iteration settings.
* Once you are happy with the results, hit one of the "Save" buttons to save a copy of the geometrized image.

## Shape Comparison

The matrix shows results for circles, triangles, rotated rectangles, rotated ellipses and all supported shapes at 50, 200 and 500 total shapes:

| -                  | 50 Shapes     | 150 Shapes    | 500 Shapes   |
| ------------------ | ------------- | ------------- | ------------ |
| Circles            | [![50 Circles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_circles.png?raw=true)](http://www.geometrize.co.uk/) | [![150 Circles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_150_circles.png?raw=true)](http://www.geometrize.co.uk/) | [![500 Circles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_circles.png?raw=true)](http://www.geometrize.co.uk/) |
| Triangles          | [![50 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_triangles.png?raw=true)](http://www.geometrize.co.uk/) | [![150 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_150_triangles.png?raw=true)](http://www.geometrize.co.uk/) | ![500 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_triangles.png?raw=true)](http://www.geometrize.co.uk/) |
| Rotated Rectangles | [![50 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_rotated_rectangles.png?raw=true)](http://www.geometrize.co.uk/) | [![150 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_150_rotated_rectangles.png?raw=true)](http://www.geometrize.co.uk/) | [![500 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_rotated_rectangles.png?raw=true)](http://www.geometrize.co.uk/) |
| Rotated Ellipses   | [![50 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_rotated_ellipses.png?raw=true)](http://www.geometrize.co.uk/) | [![150 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_150_rotated_ellipses.png?raw=true)](http://www.geometrize.co.uk/) | [![500 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_rotated_ellipses.png?raw=true)](http://www.geometrize.co.uk/) |
| All Shapes         | [![50 All Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_50_all_shapes.png?raw=true)](http://www.geometrize.co.uk/) | [![150 All Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_150_all_shapes.png?raw=true)](http://www.geometrize.co.uk/) | [![500 All Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull_500_all_shapes.png?raw=true)](http://www.geometrize.co.uk/) |

## Examples And Screenshots

Geometrized public domain [artwork](https://commons.wikimedia.org/wiki/Category:Paintings_by_painter) and [photos](https://www.pexels.com/public-domain-images/):

[![Geometrized Flower - 330 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/flower.png?raw=true "Flower - 330 Rotated Ellipses")](http://www.geometrize.co.uk/)
[![Geometrized Woodland Cemetery - 600 Rotated Rectangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/woodland_cemetery.png?raw=true "Woodland Cemetery - 600 Rotated Rectangles")](http://www.geometrize.co.uk/)
[![Geometrized Pomegranate - 300 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/pomegranate.png?raw=true "Pomegranate - 300 Rotated Ellipses")](http://www.geometrize.co.uk/)
[![Geometrized Tree Under Clouds 210 Ellipses](https://github.com/Tw1ddle/geometrize-haxe/blob/master/screenshots/tree_under_clouds.png?raw=true "Tree Under Clouds - 210 Ellipses")](http://www.geometrize.co.uk/)
[![Geometrized Monarch Butterfly - 800 Various Shapes](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/monarch_butterfly.png?raw=true "Monarch Butterfly - 800 Various Shapes")](http://www.geometrize.co.uk/)
[![Geometrized Chomsky - 300 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/chomsky.png?raw=true "Noam Chomsky - 300 Triangles")](http://www.geometrize.co.uk/)
[![Geometrized Trees 250 Rotated Ellipses](https://github.com/Tw1ddle/geometrize-haxe/blob/master/screenshots/trees.png?raw=true "Trees - 250 Rotated Ellipses")](http://www.geometrize.co.uk/)

For more examples, see the Geometrize [gallery](http://gallery.geometrize.co.uk/).

## Notes
* Got an idea or suggestion? Open an issue on GitHub, or send Sam a message on [Twitter](https://twitter.com/Sam_Twidale).
* The Geometrize Haxe library is available as a [haxelib](https://lib.haxe.org/p/geometrize-haxe).
* Find more code related to Geometrize [here](http://resources.geometrize.co.uk/).