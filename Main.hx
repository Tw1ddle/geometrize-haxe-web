package;

import geometrize.ArraySet;
import geometrize.Model.ShapeResult;
import geometrize.Util;
import geometrize.bitmap.Bitmap;
import geometrize.bitmap.Rgba;
import geometrize.exporter.SvgExporter;
import geometrize.runner.ImageRunner;
import geometrize.runner.ImageRunnerOptions;
import geometrize.shape.Rectangle;
import geometrize.shape.Shape;
import geometrize.shape.ShapeType;
import haxe.io.Bytes;
import haxe.io.Float32Array;
import js.Browser;
import js.html.AnchorElement;
import js.html.Blob;
import js.html.ButtonElement;
import js.html.CanvasElement;
import js.html.DivElement;
import js.html.Element;
import js.html.FileReader;
import js.html.Image;
import js.html.InputElement;
import js.html.TextAreaElement;
import js.html.URL;
import js.nouislider.NoUiSlider;

// Automatic HTML code completion, you need to point these to your debug/release HTML
#if debug
@:build(CodeCompletion.buildLocalFile("bin/debug/index.html"))
#else
@:build(CodeCompletion.buildLocalFile("bin/release/index.html"))
#end
//@:build(CodeCompletion.buildUrl("http://www.samcodes.co.uk/project/geometrize-haxe-web/"))
class ID {}

/**
 * A one-page website that demonstrates the Geometrize Haxe library
 * @author Sam Twidale (http://www.samcodes.co.uk/)
 */
class Main {
	private static inline var WEBSITE_URL:String = "http://www.samcodes.co.uk/project/geometrize-haxe-web/"; // Hosted demo URL

	// All the required references to the HTML page elements
	private static inline function getElement(id:String):Dynamic {
		return Browser.document.getElementById(id);
	}
	private static var runPauseButton:ButtonElement = getElement(ID.runpausebutton);
	private static var stepButton:ButtonElement = getElement(ID.stepbutton);
	private static var openImageButton:ButtonElement = getElement(ID.openimagebutton);
	private static var openImageFileInput:InputElement = getElement(ID.openimageinput);
	private static var resetButton:ButtonElement = getElement(ID.resetbutton);
	private static var saveImageButton:AnchorElement = getElement(ID.saveimagebutton);
	private static var saveSvgButton:AnchorElement = getElement(ID.savesvgbutton);
	private static var rectanglesCheckbox:InputElement = getElement(ID.rectangles);
	private static var rotatedRectanglesCheckbox:InputElement = getElement(ID.rotatedrectangles);
	private static var trianglesCheckbox:InputElement = getElement(ID.triangles);
	private static var ellipsesCheckbox:InputElement = getElement(ID.ellipses);
	private static var rotatedEllipsesCheckbox:InputElement = getElement(ID.rotatedellipses);
	private static var circlesCheckbox:InputElement = getElement(ID.circles);
	private static var linesCheckbox:InputElement = getElement(ID.lines);
	private static var shapeOpacitySlider:Element = getElement(ID.shapeopacity);
	private static var randomShapesPerStepSlider:Element = getElement(ID.randomshapesperstep);
	private static var shapeMutationsPerStepSlider:Element = getElement(ID.shapemutationsperstep);
	private static var currentImageCanvas:CanvasElement = getElement(ID.currentimagecanvas);
	private static var logoImageElement:Image = getElement(ID.geometrizehaxelogo);
	private static var seagullImageElement:Image = getElement(ID.defaultimage);
	private static var currentSvgContainer:DivElement = getElement(ID.currentsvgcontainer);
	#if debug
	private static var eventLogElement:TextAreaElement = getElement(ID.eventlog);
	private static var svgTextElement:TextAreaElement = getElement(ID.svgoutput);
	#end
	
	private var runner:ImageRunner; // The image runner reproduces an image as geometric shapes
	private var targetImage:Bitmap; // A bitmap representation of the image to geometrize

	private var maxImageSize:Int = 1024; // Max image width or height, if this is exceeded then the input image is scaled down 0.5x
	
	private var maxShapeAdditionRate:Float; // The number of times to step the model per second when running
	private var shapeTypes:ArraySet<ShapeType>;
	private var shapeOpacity:Int;
	private var candidateShapesPerStep:Int;
	private var shapeMutationsPerStep:Int;
	private var shapeResults:Array<ShapeResult>;
	private var running(default, set):Bool;

	private static function main():Void {
		var main = new Main();
	}

	private inline function new() {
		// Wait for the window to load before creating the sliders, listening for input etc
		Browser.window.onload = onWindowLoaded;
	}

	private inline function onWindowLoaded():Void {
		init();
		createSliders();
		addEventListeners();
		animate();
		running = true;
	}
	
	/**
	 * Main update loop.
	 */
	private function animate():Void {
		if(running) {
			stepRunner(); // Step the runner
		}
		
		var nextFrameDelay = Std.int((1.0 / this.maxShapeAdditionRate) * 1000.0);
		Browser.window.setTimeout(function():Void {
			this.animate();
		}, nextFrameDelay);
	}
	
	/**
	 * Step the image runner and update the canvases.
	 */
	private function stepRunner():Void {
		appendShapeResults(runner.step(constructRunnerOptions()));
		drawBitmapToCanvas(runner.getImageData(), currentImageCanvas);
	}

	private inline function constructRunnerOptions():ImageRunnerOptions {
		return new ImageRunnerOptions(shapeTypes.length == 0 ? [ ShapeType.TRIANGLE ] : shapeTypes, shapeOpacity, candidateShapesPerStep, shapeMutationsPerStep);
	}

	private inline function init():Void {
		maxShapeAdditionRate = 15.0;
		running = false;
		
		// Reset the runner options
		shapeTypes = ArraySet.create([ShapeType.TRIANGLE]);
		shapeOpacity = 128;
		candidateShapesPerStep = 50;
		shapeMutationsPerStep = 100;
		shapeResults = [];
		
		// Set the target image, which also sets up the image runner etc
		targetImage = createDefaultBitmap();
		onTargetImageChanged();
		
		trianglesCheckbox.checked = true;
	}

	/**
	 * Create the settings sliders that go on the page
	 */
	private inline function createSliders():Void {
		NoUiSlider.create(shapeOpacitySlider, {
			start: [ shapeOpacity ],
			connect: 'lower',
			range: {
				'min': [ 1, 1 ],
				'max': [ 255 ]
			},
			pips: {
				mode: 'range',
				density: 10,
			}
		});
		createTooltips(shapeOpacitySlider);
		untyped shapeOpacitySlider.noUiSlider.on(UiSliderEvent.CHANGE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			shapeOpacity = Std.int(values[handle]);
		});
		untyped shapeOpacitySlider.noUiSlider.on(UiSliderEvent.UPDATE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			updateTooltips(shapeOpacitySlider, handle, Std.int(values[handle]));
		});
		
		NoUiSlider.create(randomShapesPerStepSlider, {
			start: [ candidateShapesPerStep ],
			connect: 'lower',
			range: {
				'min': [ 10, 1 ],
				'max': [ 300 ]
			},
			pips: {
				mode: 'range',
				density: 10,
			}
		});
		createTooltips(randomShapesPerStepSlider);
		untyped randomShapesPerStepSlider.noUiSlider.on(UiSliderEvent.CHANGE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			candidateShapesPerStep = Std.int(values[handle]);
		});
		untyped randomShapesPerStepSlider.noUiSlider.on(UiSliderEvent.UPDATE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			updateTooltips(randomShapesPerStepSlider, handle, Std.int(values[handle]));
		});
		
		NoUiSlider.create(shapeMutationsPerStepSlider, {
			start: [ shapeMutationsPerStep ],
			connect: 'lower',
			range: {
				'min': [ 10, 1 ],
				'max': [ 300 ]
			},
			pips: {
				mode: 'range',
				density: 10,
			}
		});
		createTooltips(shapeMutationsPerStepSlider);
		untyped shapeMutationsPerStepSlider.noUiSlider.on(UiSliderEvent.CHANGE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			shapeMutationsPerStep = Std.int(values[handle]);
		});
		untyped shapeMutationsPerStepSlider.noUiSlider.on(UiSliderEvent.UPDATE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			updateTooltips(shapeMutationsPerStepSlider, handle, Std.int(values[handle]));
		});
	}

	/**
	 * Add event listeners to the input elements, in order to update the values we feed the runner
	 */
	private inline function addEventListeners():Void {
		runPauseButton.addEventListener("click", function() {
			running = !running;
		}, false);
		
		openImageFileInput.addEventListener("change", function(e:Dynamic):Void {
			if (openImageFileInput.files == null || openImageFileInput.files.length == 0) {
				return;
			}
			
			var file = openImageFileInput.files[0];
			var fileReader = new FileReader();
			fileReader.onload = function(e) {
				var image = new Image();
				image.onload = function(e) {
					var canvas:CanvasElement = imageToCanvas(image);
					while (canvas.width > maxImageSize || canvas.height > maxImageSize) { // Resize images since huge ones are too slow in this implementation
						canvas = downScaleCanvas(canvas, 0.5);
					}
					targetImage = canvasToBitmap(canvas);
					onTargetImageChanged();
				}
				image.src = fileReader.result;
			};
			fileReader.readAsDataURL(file);
			
			openImageFileInput.files[0] = null;
		}, false);
		
		stepButton.addEventListener("click", function() {
			stepRunner();
		}, false);
		
		resetButton.addEventListener("click", function() {
			targetImage = targetImage;
			onTargetImageChanged();
		}, false);
		
		saveImageButton.addEventListener("click", function(e:Dynamic):Void {
			var canvas:Dynamic = Browser.document.createCanvasElement();
			drawBitmapToCanvas(runner.getImageData(), canvas);
			
			if (canvas.msToBlob != null) {
				var blob = canvas.msToBlob();
				var navigator:Dynamic = Browser.window.navigator;
				navigator.msSaveBlob(blob, "geometrized_image.png");
			} else {
				var data = canvas.toDataURL("image/png");
				saveImageButton.download = "geometrized_image.png";
				saveImageButton.href = data;
			}
		}, false);
		
		saveSvgButton.addEventListener("click", function(e:Dynamic):Void {
			var data = SvgExporter.export(shapeResults, runner.model.width, runner.model.height);
			var svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
			
			var navigator:Dynamic = Browser.window.navigator;
			if (navigator.msSaveBlob != null) {
				navigator.msSaveBlob(svgBlob, "geometrized_svg.svg");
			} else {
				var svgUrl = URL.createObjectURL(svgBlob);
				saveSvgButton.download = "geometrized_svg.svg";
				saveSvgButton.href = svgUrl;
			}
		}, false);
		
		var setShapeOption = function(option:ShapeType, enable:Bool):Void {
			if (enable) {
				shapeTypes.add(option);
			} else {
				shapeTypes.remove(option);
			}
		};
		rectanglesCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.RECTANGLE, rectanglesCheckbox.checked);
		}, false);
		rotatedRectanglesCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.ROTATED_RECTANGLE, rotatedRectanglesCheckbox.checked);
		}, false);
		trianglesCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.TRIANGLE, trianglesCheckbox.checked);
		}, false);
		ellipsesCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.ELLIPSE, ellipsesCheckbox.checked);
		}, false);
		rotatedEllipsesCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.ROTATED_ELLIPSE, rotatedEllipsesCheckbox.checked);
		}, false);
		circlesCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.CIRCLE, circlesCheckbox.checked);
		}, false);
		linesCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.LINE, linesCheckbox.checked);
		}, false);
	}

	/**
	 * Helper method to create tooltips on the sliders
	 */
	private function createTooltips(slider:Element):Void {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		for (i in 0...tipHandles.length) {
			var div = js.Browser.document.createElement('div');
			div.className += "tooltip";
			tipHandles[i].appendChild(div);
			updateTooltips(slider, i, 0);
		}
	}

	/**
	 * Helper method to update the tooltips on the sliders
	 */
	private function updateTooltips(slider:Element, handleIdx:Int, value:Float):Void {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		tipHandles[handleIdx].innerHTML = "<span class='tooltip'>" + Std.string(value) + "</span>";
	}
	
	/**
	 * Appends a message to an onscreen event log/text area
	 */
	private function appendEventText(message:String):Void {
		#if debug
		if (eventLogElement.value == null) {
			eventLogElement.value = "";
		}
		eventLogElement.value += message + "\n";
		#end
	}
	
	/**
	 * Clears the onscreen event log/text area
	 */
	private function clearEventText():Void {
		#if debug
		eventLogElement.value = "";
		#end
	}
	
	/**
	 * Appends text to the SVG export text area
	 */
	private function appendSvgText(message:String):Void {
		#if debug
		if (svgTextElement.value == null) {
			svgTextElement.value = "";
		}
		svgTextElement.value += message + "\n";
		#end
	}
	
	/**
	 * Clears the onscreen SVG shape data output log/text area
	 */
	private function clearSvgText():Void {
		#if debug
		svgTextElement.value = "";
		#end
	}
	
	/**
	 * Appends some shape result info to the current shape results
	 */
	private function appendShapeResults(results:Array<ShapeResult>) {
		shapeResults = shapeResults.concat(results);
		
		for (result in results) {
			var shape:Shape = result.shape;
			appendEventText("Added shape " + shapeResults.length + ": " + shape.getType() + " with data " + shape.getRawShapeData());
			appendSvgText(SvgExporter.exportShape(result));
		}
		
		setSvgElement(SvgExporter.export(shapeResults, runner.model.width, runner.model.height)); // NOTE should really append shape-by-shape rather than doing the whole SVG
	}
	
	/**
	 * Draws a bitmap to a HTML5 canvas element, resizing the canvas to the size of the bitmap.
	 */
	private function drawBitmapToCanvas(bitmap:Bitmap, canvas:CanvasElement):CanvasElement {
		canvas.width = bitmap.width;
		canvas.height = bitmap.height;
		var context = canvas.getContext2d();
		var imageData = context.createImageData(canvas.width, canvas.height);
		var bytesData = bitmap.getBytes();
		for (i in 0...bytesData.length) {
			imageData.data[i] = bytesData.get(i);
		}
		context.putImageData(imageData, 0, 0);
		
		return canvas;
	}
	
	/**
	 * Converts a HTML5 canvas to a bitmap object
	 */
	private function canvasToBitmap(canvas:CanvasElement):Bitmap {
		var context = canvas.getContext2d();
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var bytesData:Bytes = Bytes.alloc(imageData.data.length);
		for (i in 0...bytesData.length) {
			bytesData.set(i, imageData.data[i]);
		}
		var bitmap:Bitmap = Bitmap.createFromBytes(canvas.width, canvas.height, bytesData);
		return bitmap;
	}
	
	/**
	 * Converts an HTML image to a HTML5 canvas
	 */
	private function imageToCanvas(image:Image):CanvasElement {
		var canvas:CanvasElement = Browser.document.createCanvasElement();
		canvas.width = image.width;
		canvas.height = image.height;
		var context = canvas.getContext2d();
		context.drawImage(image, 0, 0);
		return canvas;
	}
	
	/**
	 * Sets up the initial SVG image element.
	 * @param	The code for the initial SVG element.
	 */
	private function setSvgElement(svgCode:String) {
		currentSvgContainer.innerHTML = svgCode;
	}
	
	/**
	 * Creates the default bitmap image used for the demo.
	 * @return	The default bitmap image.
	 */
	private function createDefaultBitmap():Bitmap {
		return canvasToBitmap(imageToCanvas(seagullImageElement));
	}
	
	private function onTargetImageChanged():Void {
		if (runner == null) {
			appendEventText("Initializing image runner and setting default bitmap...");
		} else {
			appendEventText("Resetting current image and removing shapes...");
		}
		
		var backgroundColor:Rgba = Util.getAverageImageColor(targetImage);
		runner = new ImageRunner(targetImage, backgroundColor);
		drawBitmapToCanvas(runner.getImageData(), currentImageCanvas);
		
		clearEventText();
		clearSvgText();
		
		shapeResults = [];
		
		var backgroundRect = new Rectangle(targetImage.width, targetImage.height);
		backgroundRect.x1 = 0;
		backgroundRect.y1 = 0;
		backgroundRect.x2 = targetImage.width - 1;
		backgroundRect.y2 = targetImage.height - 1;
		appendShapeResults([ { score : 0.0, color: backgroundColor, shape: backgroundRect } ]);
	}
	
	private function set_running(running:Bool):Bool {
		runPauseButton.innerHTML = (running ? "<h2>Pause</h2>" : "<h2>Run</h2>");
		return this.running = running;
	}
	
	/**
	 * Based on http://stackoverflow.com/a/19144434/1333253 by GameAlchemist
	 * Scales the canvas down, 0 < scale < 1, and returns a new canvas containing the scaled image.
	 * @param	cv	The canvas to scale down.
	 * @param	scale	The canvas scale factor.
	 * @return	The scaled down canvas.
	 */
	private static function downScaleCanvas(cv:Dynamic, scale:Float):CanvasElement {
		if (scale <= 0.0 || scale >= 1.0) {
			throw ('Scale must be a positive number < 1');
		}
		
		var sqScale:Float = scale * scale; // Square scale = area of source pixel within target
		var sw:Int = cv.width; // Source image width
		var sh:Int = cv.height; // Source image height
		var tw:Int = Std.int(sw * scale); // Target image width
		var th:Int = Std.int(sh * scale); // Target image height
		
		var sx:Int = 0; // Source x
		var sy:Int = 0; // Source y
		var sIndex:Int = 0; // Index within source array
		
		var tx:Int = 0; // Target x
		var ty:Int = 0; // Target y
		var yIndex:Int = 0; // x index within target array
		var tIndex:Int = 0; // y index within target array
		
		var tX:Int = 0; // Rounded tx
		var tY:Int = 0; // Rounded ty
		
		// Weight is weight of current source point within target
		// Next weight is weight of current source point within next target point
		var w:Float = 0.0; // Weight
		var nw:Float = 0.0; // Next weight
		var wx:Float = 0.0; // Weight x
		var nwx:Float = 0.0; // Next weight x
		var wy:Float = 0.0; // Weight y
		var nwy:Float = 0.0; // Next weight y

		var crossX = false; // Does scaled px cross its current px right border
		var crossY = false; // Does scaled px cross its current px bottom border
		
		var sBuffer = cv.getContext('2d').getImageData(0, 0, sw, sh).data; // Source buffer 8 bit RGBA
		var tBuffer = new Float32Array(3 * tw * th); // Target buffer Float32 RGB
		
		// Current source point RGB
		var sR = 0.0;
		var sG = 0.0;
		var sB = 0.0;
		
		while (sy < sh) {
			ty = Std.int(sy * scale); // Source y position within target
			tY = Std.int(ty); // Rounded target pixel y
			yIndex = Std.int(3 * tY * tw); // Line index within target array
			
			// If pixel is crossing botton target pixel
			crossY = (tY != Std.int(ty + scale));
			if (crossY) {
				wy = (tY + 1 - ty); // Weight of point within target pixel
				nwy = (ty + scale - tY - 1); // ... Within y + 1 target pixel
			}
			
			sx = 0;
			while (sx < sw) {
				tx = Std.int(sx * scale); // Source x position within target
				tX = Std.int(tx); // Rounded target pixel x
				tIndex = Std.int(yIndex + tX * 3); // Target pixel index within target array
				
				// If pixel is crossing target pixel's right
				crossX = (tX != Math.floor(tx + scale));
				if (crossX) {
					wx = (tX + 1 - tx); // Weight of point within target pixel
					nwx = Std.int(tx + scale - tX - 1); // ... Within x + 1 target pixel
				}
				
				// Retrieving RGB for current source pixel
				sR = sBuffer[sIndex];
				sG = sBuffer[sIndex + 1];
				sB = sBuffer[sIndex + 2];

				if (!crossX && !crossY) {
					// Pixel does not cross
					// Add components weighted by squared scale
					tBuffer[tIndex] += sR * sqScale;
					tBuffer[tIndex + 1] += sG * sqScale;
					tBuffer[tIndex + 2] += sB * sqScale;
				} else if (crossX && !crossY) {
					// Pixel crosses on x only
					// Add weighted component for current px
					w = wx * scale;
					tBuffer[tIndex] += sR * w;
					tBuffer[tIndex + 1] += sG * w;
					tBuffer[tIndex + 2] += sB * w;
					
					// Add weighted component for next (tX+1) px
					nw = nwx * scale;
					tBuffer[tIndex + 3] += sR * nw;
					tBuffer[tIndex + 4] += sG * nw;
					tBuffer[tIndex + 5] += sB * nw;
				} else if (crossY && !crossX) {
					// Pixel crosses on y only
					// Add weighted component for current px
					w = wy * scale;
					tBuffer[tIndex] += sR * w;
					tBuffer[tIndex + 1] += sG * w;
					tBuffer[tIndex + 2] += sB * w;
					
					// Add weighted component for next (tY+1) px
					nw = nwy * scale;
					tBuffer[tIndex + 3 * tw] += sR * nw;
					tBuffer[tIndex + 3 * tw + 1] += sG * nw;
					tBuffer[tIndex + 3 * tw + 2] += sB * nw;
				} else {
					// Pixel crosses both x and y, four target points involved
					// Add weighted component for current px
					w = wx * wy;
					tBuffer[tIndex] += sR * w;
					tBuffer[tIndex + 1] += sG * w;
					tBuffer[tIndex + 2] += sB * w;
					
					// For tX + 1; tY px
					nw = nwx * wy;
					tBuffer[tIndex + 3] += sR * nw;
					tBuffer[tIndex + 4] += sG * nw;
					tBuffer[tIndex + 5] += sB * nw;
					
					// For tX ; tY + 1 px
					nw = wx * nwy;
					tBuffer[tIndex + 3 * tw] += sR * nw;
					tBuffer[tIndex + 3 * tw + 1] += sG * nw;
					tBuffer[tIndex + 3 * tw + 2] += sB * nw;
					
					// For tX + 1 ; tY +1 px
					nw = nwx * nwy;
					tBuffer[tIndex + 3 * tw + 3] += sR * nw;
					tBuffer[tIndex + 3 * tw + 4] += sG * nw;
					tBuffer[tIndex + 3 * tw + 5] += sB * nw;
				}
				
				sIndex += 4;
				sx++;
			}
			sy++;
		}

		// Create result canvas
		var result:CanvasElement = Browser.document.createCanvasElement();
		result.width = tw;
		result.height = th;
		var resultContext = result.getContext('2d');
		var resultImage = resultContext.getImageData(0, 0, tw, th);
		var tByteBuffer = resultImage.data;
		
		// Convert float32 array into a UInt8Clamped Array
		var pxIndex:Int = 0;
		sIndex = 0;
		tIndex = 0;
		
		while (pxIndex < tw * th) {
			tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
			tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
			tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
			tByteBuffer[tIndex + 3] = 255;
			
			sIndex += 3;
			tIndex += 4;
			pxIndex++;
		}
		
		// Writing result to canvas
		resultContext.putImageData(resultImage, 0, 0);
		return result;
	}
}