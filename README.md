[![Project logo](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/logo.png?raw=true "Geometrize Haxe Web Demo Project logo")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

**Geometrize Haxe** is a tool for recreating images as geometric primitives. Run the demo [in your browser](http://www.samcodes.co.uk/project/geometrize-haxe-web/).

Demonstrates the [geometrize-haxe library](https://github.com/Tw1ddle/geometrize-haxe). Read the [documentation here](http://tw1ddle.github.io/geometrize-haxe/).

Geometrize Haxe is based on the [primitive](https://github.com/fogleman/primitive) library.

[![Monarch Butterfly](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/monarch_butterfly.jpg?raw=true "Monarch Butterfly")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

## Features
* Recreate images as shapes - rectangles, triangles, circles, ellipses, lines and more.
* Change interactive options for shape types, shape opacity and performance.
* Save geometrized images as PNG images, SVGs, or JSON data.
* View to see the geometrized image build up in realtime.

## Usage

Try the demo and geometrize your own images. An example:

```
Image: seagull.png
Shape Opacity: 128/255
Random Shapes Per Step: 100
Shape Mutations Per Step: 100
Shape Types: Triangles
```

Hit "Run" and the geometrized image will gradually form. Here are the results after a few hundred shapes are added:

[![Geometrized Seagull](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/seagull.jpg?raw=true "A seagull geometrized into triangles")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

Hit one of the save buttons to save copies of your geometrized image.

Note that the first steps can be slow, because large shapes are often drawn early. Large images also slow things down - small target images are recommended, you do not need the detail anyway.

## Resources

* See the Geometrize [resources](https://github.com/Tw1ddle/geometrize-resources) and [template](https://github.com/Tw1ddle/geometrize-templates) repositories.
* See the Geometrize [haxelib code](https://github.com/Tw1ddle/geometrize-haxe) and library [documentation](http://tw1ddle.github.io/geometrize-haxe/).
* See the HaxeFlixel Geometrize [demo](http://tw1ddle.github.io/geometrize-haxe-demo/) and the [demo code](https://github.com/Tw1ddle/geometrize-haxe-demo/).
* See the Primitive Go [repository](https://github.com/fogleman/primitive).

## Screenshots

Examples from geometrizing public domain [artwork](https://commons.wikimedia.org/wiki/Category:Paintings_by_painter) and [photos](https://www.pexels.com/public-domain-images/):

[![Geometrized Swan](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/swan.jpg?raw=true "Swan")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Leafy Railroad](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/leafy_railroad.jpg?raw=true "Leafy Railroad")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Road](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/road.jpg?raw=true "Road")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Sunflower](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/sunflower.jpg?raw=true "Sunflower")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Woodland Cemetery](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/woodland_cemetery.jpg?raw=true "Woodland Cemetery")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Gustave Courbet](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/gustave_courbet.jpg?raw=true "Gustave Courbet")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Pomegranate](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/pomegranate.jpg?raw=true "Pomegranate")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Fairies](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/fairies.jpg?raw=true "Fairies")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Pyramid](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/pyramid.jpg?raw=true "Pyramid")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Chomsky](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/chomsky.jpg?raw=true "Noam Chomsky")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)
[![Geometrized Mixed Peppers](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/mixed_peppers.jpg?raw=true "Mixed Peppers")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

Here is the demo in action:

[![Geometrize Web Demo Screenshot](https://github.com/Tw1ddle/geometrize-haxe-web/blob/master/screenshots/mixed_fruit_demo.jpg?raw=true "Geometrized Mixed Fruit")](http://www.samcodes.co.uk/project/geometrize-haxe-web/)

## Notes
* Got an idea or suggestion? Open an issue on GitHub, or send Sam a message on [Twitter](https://twitter.com/Sam_Twidale).
* Search sites like [Wikimedia](https://en.wikipedia.org/wiki/List_of_Pre-Raphaelite_paintings) or [Pexels](https://www.pexels.com/) for inspiration.
* Geometrize Haxe is based on [primitive](https://github.com/fogleman/primitive), a Go library created by [Michael Fogleman](https://github.com/fogleman).
* Geometrize Haxe is available as a [haxelib](https://lib.haxe.org/p/geometrize-haxe).
* This demo works with the Haxe JavaScript target.
