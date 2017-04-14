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
	private static var currentSvgContainer:DivElement = getElement(ID.currentsvgcontainer);
	#if debug
	private static var eventLogElement:TextAreaElement = getElement(ID.eventlog);
	private static var svgTextElement:TextAreaElement = getElement(ID.svgoutput);
	#end
	
	private var runner:ImageRunner; // The image runner reproduces an image as geometric shapes
	private var targetImage(default, set):Bitmap; // A bitmap representation of the image to geometrize

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
		return new ImageRunnerOptions(shapeTypes.length == 0 ? [ ShapeType.CIRCLE ] : shapeTypes, shapeOpacity, candidateShapesPerStep, shapeMutationsPerStep);
	}

	private inline function init():Void {
		maxShapeAdditionRate = 15.0;
		running = false;
		
		// Reset the runner options
		shapeTypes = ArraySet.create([ShapeType.CIRCLE]);
		shapeOpacity = 128;
		candidateShapesPerStep = 50;
		shapeMutationsPerStep = 100;
		shapeResults = [];
		
		// Set the target image, which also sets up the image runner etc
		targetImage = createDefaultBitmap();
		
		circlesCheckbox.checked = true;
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
				image.src = fileReader.result;
				image.onload = function(e) {
					targetImage = canvasToBitmap(imageToCanvas(image));
				}
			};
			fileReader.readAsDataURL(file);
		}, false);
		
		stepButton.addEventListener("click", function() {
			stepRunner();
		}, false);
		
		resetButton.addEventListener("click", function() {
			targetImage = targetImage;
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
		return canvasToBitmap(imageToCanvas(logoImageElement));
	}
	
	private function set_targetImage(bitmap:Bitmap):Bitmap {
		if (runner == null) {
			appendEventText("Initializing image runner and setting default bitmap...");
		} else {
			appendEventText("Resetting current image and removing shapes...");
		}
		
		this.targetImage = bitmap;
		var backgroundColor:Rgba = Util.getAverageImageColor(bitmap);
		runner = new ImageRunner(targetImage, backgroundColor);
		drawBitmapToCanvas(runner.getImageData(), currentImageCanvas);
		
		clearEventText();
		clearSvgText();
		
		shapeResults = [];
		
		var backgroundRect = new Rectangle(bitmap.width, bitmap.height);
		backgroundRect.x1 = 0;
		backgroundRect.y1 = 0;
		backgroundRect.x2 = bitmap.width - 1;
		backgroundRect.y2 = bitmap.height - 1;
		appendShapeResults([ { score : 0.0, color: backgroundColor, shape: backgroundRect } ]);
		
		return this.targetImage;
	}
	
	private function set_running(running:Bool):Bool {
		runPauseButton.innerHTML = (running ? "<h2>Pause</h2>" : "<h2>Run</h2>");
		return this.running = running;
	}
}