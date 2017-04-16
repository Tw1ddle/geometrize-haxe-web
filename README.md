[![Project logo](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/logo.png?raw=true "Geometrize Haxe Web Demo Project logo")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

Interactive demo for **Geometrize Haxe**, a tool for recreating images as geometric primitives. Run the demo [in your browser](http://www.samcodes.co.uk/project/geometrize-haxe-web/).

Demonstrates the [geometrize-haxe](https://github.com/Tw1ddle/geometrize-haxe) library. Read the [documentation here](http://tw1ddle.github.io/geometrize-haxe/).

Geometrize Haxe is based on [primitive](https://github.com/fogleman/primitive).

[![Geometrized Swan - 400 Triangles](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/swan.jpg?raw=true "Geometrized Swan - 400 Triangles")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

## Features
* Recreate images as shapes - rectangles, triangles, circles, ellipses, lines and more.
* Change interactive options for shape types, shape opacity and performance.
* Save geometrized images as PNGs or vector-based SVGs.
* Watch geometrized images build up in realtime.

## Usage

Use the [demo](http://www.samcodes.co.uk/project/geometrize-haxe-web/) to geometrize your own images. For example:

```
Image: seagull.png
Shape Opacity: 128/255
Random Shapes Per Step: 100
Shape Mutations Per Step: 100
Shape Types: Ellipses, Triangles
```

Hit "Run" and the geometrized image will gradually take form. Here are the results for 220 shapes (100 ellipses and 120 triangles):

[![Geometrized Seagull](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull.jpg?raw=true "Geometrized Seagull - 100 Ellipses, 120 Triangles")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

Hit one of the save buttons to save copies of the geometrized image.

Note that the first steps can be slow, because larger shapes are drawn earlier in the process. Large images will also slow things down - small target images are recommended, you do not need the detail anyway.

## Resources

* See the Geometrize [resources](https://github.com/Tw1ddle/geometrize-resources) and [template](https://github.com/Tw1ddle/geometrize-templates) repositories.
* See the Geometrize [haxelib code](https://github.com/Tw1ddle/geometrize-haxe) and library [documentation](http://tw1ddle.github.io/geometrize-haxe/).
* See the HaxeFlixel Geometrize [demo](http://tw1ddle.github.io/geometrize-haxe-demo/) and the [demo code](https://github.com/Tw1ddle/geometrize-haxe-demo/).
* See the Primitive Go [repository](https://github.com/fogleman/primitive).

## Examples And Screenshots

There is no jagginess when saving images as vector-based SVG e.g. [pyramid](https://gist.github.com/Tw1ddle/31f211f0ae13af49302dc283a74522c3) or [pomegranate](https://gist.github.com/Tw1ddle/817fcef96c81ad5d2ece3a21b2aea124).

Examples from geometrizing public domain [artwork](https://commons.wikimedia.org/wiki/Category:Paintings_by_painter) and [photos](https://www.pexels.com/public-domain-images/):

[![Geometrized Leafy Railroad](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/leafy_railroad.jpg?raw=true "Leafy Railroad")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Road](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/road.jpg?raw=true "Road")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Sunflower](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/sunflower.jpg?raw=true "Sunflower")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Woodland Cemetery](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/woodland_cemetery.jpg?raw=true "Woodland Cemetery")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Pomegranate](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/pomegranate.jpg?raw=true "Pomegranate")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Monarch Butterfly](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/monarch_butterfly.jpg?raw=true "Monarch Butterfly")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Gustave Courbet](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/gustave_courbet.jpg?raw=true "Gustave Courbet")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Fairies](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/fairies.jpg?raw=true "Fairies")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Pyramid](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/pyramid.jpg?raw=true "Pyramid")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Chomsky](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/chomsky.jpg?raw=true "Noam Chomsky")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Mixed Peppers](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/mixed_peppers.jpg?raw=true "Mixed Peppers")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

## Notes
* Got an idea or suggestion? Open an issue on GitHub, or send Sam a message on [Twitter](https://twitter.com/Sam_Twidale).
* Geometrize Haxe is based on [primitive](https://github.com/fogleman/primitive), a Go library created by [Michael Fogleman](https://github.com/fogleman).
* This demo works with the Haxe JavaScript target.
* Geometrize Haxe is available as a [haxelib](https://lib.haxe.org/p/geometrize-haxe).
