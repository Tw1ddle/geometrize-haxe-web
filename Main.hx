package;

#if geometrize_frontend

import geometrize.ArraySet;
import geometrize.Model.ShapeResult;
import geometrize.Util;
import geometrize.bitmap.Bitmap;
import geometrize.bitmap.Rgba;
import geometrize.exporter.ShapeJsonExporter;
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
import js.html.Window;
import js.html.XMLSerializer;
import GeometrizeWorkerMessages;

// Automatic HTML code completion, you need to point these to your HTML
@:build(CodeCompletion.buildLocalFile("bin/index.html"))
//@:build(CodeCompletion.buildUrl("https://www.samcodes.co.uk/project/geometrize-haxe-web/"))
class ID {}

/**
 * A one-page app that demonstrates the Geometrize Haxe library
 * @author Sam Twidale (https://www.geometrize.co.uk/)
 */
class Main {
	private static inline var WEBSITE_URL:String = "https://www.samcodes.co.uk/project/geometrize-haxe-web/"; // Hosted demo URL

	// References to the HTML page elements we need
	private static inline function getElement(id:String):Dynamic {
		return Browser.document.getElementById(id);
	}
	private static var runPauseButton:ButtonElement = getElement(ID.runpausebutton);
	private static var stepButton:ButtonElement = getElement(ID.stepbutton);
	private static var openImageButton:ButtonElement = getElement(ID.openimagebutton);
	private static var openImageFileInput:InputElement = getElement(ID.openimageinput);
	private static var randomImageButton:ButtonElement = getElement(ID.randomimagebutton);
	private static var resetButton:ButtonElement = getElement(ID.resetbutton);
	private static var saveImageButton:AnchorElement = getElement(ID.saveimagebutton);
	private static var saveSvgButton:AnchorElement = getElement(ID.savesvgbutton);
	private static var saveJsonButton:AnchorElement = getElement(ID.savejsonbutton);
	
	private static var rectanglesCheckbox:InputElement = getElement(ID.rectangles);
	private static var rotatedRectanglesCheckbox:InputElement = getElement(ID.rotatedrectangles);
	private static var trianglesCheckbox:InputElement = getElement(ID.triangles);
	private static var ellipsesCheckbox:InputElement = getElement(ID.ellipses);
	private static var rotatedEllipsesCheckbox:InputElement = getElement(ID.rotatedellipses);
	private static var circlesCheckbox:InputElement = getElement(ID.circles);
	private static var linesCheckbox:InputElement = getElement(ID.lines);
	private static var quadraticBeziersCheckbox:InputElement = getElement(ID.quadraticbeziers);
	
	private static var shapeOpacitySlider:Element = getElement(ID.shapeopacity);
	private static var initialBackgroundOpacitySlider:Element = getElement(ID.initialbackgroundopacity);
	private static var randomShapesPerStepSlider:Element = getElement(ID.randomshapesperstep);
	private static var shapeMutationsPerStepSlider:Element = getElement(ID.shapemutationsperstep);
	
	private static var shapesAddedText:Element = getElement(ID.shapesaddedtext);
	private static var maxShapesCapTextEdit:TextAreaElement = getElement(ID.maxshapescaptextedit);
	
	private static var currentSvgContainer:DivElement = getElement(ID.currentsvgcontainer);
	
	private static var sampleImagesContainer:DivElement = getElement(ID.sampleimages);
	private static var defaultImageElement:Image = getElement(ID.defaultimage);
	private static var imagesToGeometrize:Array<String> = [
		"assets/images/demo_images/beach_sunset.jpg",
		"assets/images/demo_images/boat.jpg",
		"assets/images/demo_images/borrowdale_valley.jpg",
		"assets/images/demo_images/building.jpg",
		"assets/images/demo_images/borrowdale_valley.jpg",
		"assets/images/demo_images/building.jpg",
		"assets/images/demo_images/candle_yet_another.jpg",
		"assets/images/demo_images/cat_staring.jpg",
		"assets/images/demo_images/chomsky.jpg",
		"assets/images/demo_images/grapefruit.jpg",
		"assets/images/demo_images/london.jpg",
		"assets/images/demo_images/lynx_staring.jpg",
		"assets/images/demo_images/mindblown.jpg",
		"assets/images/demo_images/mountain.jpg",
		"assets/images/demo_images/papillon_dog.jpg",
		"assets/images/demo_images/pier.jpg",
		"assets/images/demo_images/pylon_and_sun.jpg",
		"assets/images/demo_images/seagull.jpg",
		"assets/images/demo_images/sun_and_tree.jpg",
		"assets/images/demo_images/sun_over_hills.jpg",
		"assets/images/demo_images/the_great_pyramid_at_giza.jpg",
		"assets/images/demo_images/the_lady_of_shalott.jpg",
		"assets/images/demo_images/tree_and_clouds.jpg",
		"assets/images/demo_images/windswept.jpg",
		"assets/images/demo_images/wolf.jpg",
		"assets/images/demo_images/woodland_cemetery.jpg"
	];
	
	private var worker:GeometrizeWorkerInterface;

	private var maxInputImageSize:Int = 768; // Max image width or height, if this is exceeded then the input image is scaled down 0.5x
	private var shapeTypes:ArraySet<ShapeType> = ArraySet.create([ShapeType.ROTATED_ELLIPSE]);
	private var shapeOpacity:Float = 128;
	private var initialBackgroundOpacity:Float = 255;
	private var candidateShapesPerStep:Int = 50;
	private var shapeMutationsPerStep:Int = 100;
	
	private var shapeSvgData:Array<String> = []; // SVG shape results
	private var shapeJsonData:Array<String> = []; // JSON shape results
	
	private var shapeCount(get, never):Int; // Number of shapes in the current geometrized image data
	public function get_shapeCount():Int {
		return shapeSvgData.length;
	}
	
	private var maxShapeCountLimit(get, set):Int;
	private static inline var defaultMaxShapeCountLimit:Int = 3000;
	private function get_maxShapeCountLimit():Int {
		var text:String = maxShapesCapTextEdit.value;
		var value:Null<Int> = Std.parseInt(text);
		if (value != null) {
			return value;
		}
		return defaultMaxShapeCountLimit; // Something went wrong, bad formatting perhaps
	}
	private function set_maxShapeCountLimit(limit:Int):Int {
		maxShapesCapTextEdit.value = Std.string(limit);
		return limit;
	}
	
	private var targetImage:Bitmap = null; // A bitmap representation of the image that is recreated using shapes
	private var running(default, set):Bool;

	private static function main():Void {
		var main = new Main();
	}

	private inline function new() {
		// Wait for the window to load before creating the sliders, listening for input etc
		Browser.window.onload = onWindowLoaded;
	}

	/**
	 * One-time initialization.
	 */
	private inline function onWindowLoaded():Void {
		// Start with ellipses enabled (note this must match the default selected shape types above)
		rotatedEllipsesCheckbox.checked = true;
		
		createSliders();
		addEventListeners();
		setupStopConditions();
		
		// Start listening for web worker messages
		setupWorker();
		
		// Set the target image
		targetImage = createDefaultBitmap();
		onTargetImageChanged();
		
		running = true;
	}
	
	/**
	 * Create the settings sliders that go on the page.
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
		
		NoUiSlider.create(initialBackgroundOpacitySlider, {
			start: [ initialBackgroundOpacity ],
			connect: 'lower',
			range: {
				'min': [ 0, 1 ],
				'max': [ 255 ]
			},
			pips: {
				mode: 'range',
				density: 10,
			}
		});
		createTooltips(initialBackgroundOpacitySlider);
		untyped initialBackgroundOpacitySlider.noUiSlider.on(UiSliderEvent.CHANGE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			initialBackgroundOpacity = Std.int(values[handle]);
		});
		untyped initialBackgroundOpacitySlider.noUiSlider.on(UiSliderEvent.UPDATE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			updateTooltips(initialBackgroundOpacitySlider, handle, Std.int(values[handle]));
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
	 * Setup event listeners for the various interactive input elements.
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
					while (canvas.width > maxInputImageSize || canvas.height > maxInputImageSize) { // Resize images since huge ones are too slow in this implementation
						canvas = CanvasTools.downScaleCanvas(canvas, 0.5);
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
		
		randomImageButton.addEventListener("click", function() {
			var image = new Image();
			image.onload = function() {
				sampleImagesContainer.appendChild(image);
				targetImage = canvasToBitmap(imageToCanvas(image));
				onTargetImageChanged();
			};
			image.src = imagesToGeometrize[Math.floor(Math.random() * imagesToGeometrize.length)];
		}, false);
		
		resetButton.addEventListener("click", function() {
			targetImage = targetImage;
			onTargetImageChanged();
		}, false);
		
		saveImageButton.addEventListener("click", function(e:Dynamic):Void {
			var svgData = "data:image/svg+xml;base64," + Browser.window.btoa(makeSvgData());
			var svgImage = new Image();
			svgImage.onload = function() {
				var canvas:Dynamic = imageToCanvas(svgImage);
				
				if (canvas.msToBlob != null) {
					var blob = canvas.msToBlob();
					var navigator:Dynamic = Browser.window.navigator;
					navigator.msSaveBlob(blob, "geometrized_image.png");
				} else {
					var data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
					
					// Run a fake click on a temporary link, because the click on the save image button is handled before image is ready on Firefox/Chrome
					var tempLink:AnchorElement = Browser.document.createAnchorElement();
					tempLink.href = data;
					tempLink.download = "geometrized_image.png";
					Browser.document.body.appendChild(tempLink);
					tempLink.click();
					Browser.document.body.removeChild(tempLink);
				}
			}
			svgImage.setAttribute("src", svgData);
		}, false);
		
		var saveBlob = function(data:String, dataType:String, filename:String, anchor:AnchorElement) {
			var blob = new Blob([data], { type: dataType });
			
			var navigator:Dynamic = Browser.window.navigator;
			if (navigator.msSaveBlob != null) {
				navigator.msSaveBlob(blob, filename);
			} else {
				var dataUrl = URL.createObjectURL(blob);
				anchor.download = filename;
				anchor.href = dataUrl;
			}
		};
		
		saveSvgButton.addEventListener("click", function(e:Dynamic):Void {
			saveBlob(currentSvgContainer.innerHTML, "image/svg+xml;charset=utf-8", "geometrized_svg.svg", saveSvgButton);
		}, false);
		
		saveJsonButton.addEventListener("click", function(e:Dynamic):Void {
			saveBlob("[\r\n" + shapeJsonData.join(",\r\n") + "\r\n]", "data:text/json;charset=utf-8", "geometrized_json.json", saveJsonButton);
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
		quadraticBeziersCheckbox.addEventListener("click", function() {
			setShapeOption(ShapeType.QUADRATIC_BEZIER, quadraticBeziersCheckbox.checked);
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
	 * Helper method to update the tooltips on the sliders.
	 */
	private function updateTooltips(slider:Element, handleIdx:Int, value:Float):Void {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		tipHandles[handleIdx].innerHTML = "<span class='tooltip'>" + Std.string(value) + "</span>";
	}
	
	/**
	 * Setup stop conditions that can be used to stop the geometrization when some limit is reached (e.g. number of shapes).
	 */
	private inline function setupStopConditions():Void {
		// Default the max shapes cap to something large
		maxShapeCountLimit = defaultMaxShapeCountLimit;
	}
	
	/**
	 * Sets up a new Geometrize web worker, first terminating the existing one if present.
	 */
	private inline function setupWorker():Void {
		if (worker != null) {
			worker.terminate();
		}
		worker = new GeometrizeWorkerInterface(); // For communicating with the Geometrize web worker
		worker.onMessage = onWorkerMessageReceived;
	}
	
	/**
	 * Checks the stopping conditions e.g. has the shapes added limit been exceeded.
	 * Stops the geometrization if the stop conditions are met.
	 */
	private function checkStopConditions():Void {
		if (shapeCount >= maxShapeCountLimit) {
			running = false;
		}
	}
	
	/**
	 * Step the image runner.
	 */
	private function stepRunner():Void {
		
		var options:ImageRunnerOptions = {
			shapeTypes: shapeTypes.length == 0 ? [ ShapeType.TRIANGLE ] : shapeTypes,
			alpha: Std.int(shapeOpacity),
			candidateShapesPerStep: candidateShapesPerStep,
			shapeMutationsPerStep: shapeMutationsPerStep
		};
		worker.postMessage({ id: FrontendToWorkerMessageId.STEP, data: options });
	}
	
	/**
	 * Callback called when a message is received from the Geometrize web worker.
	 * @param	message The web worker message object.
	 */
	private function onWorkerMessageReceived(message:WorkerToFrontendMessage) {
		switch(message.id) {
			case WorkerToFrontendMessageId.DID_SET_TARGET_IMAGE:
				
			case WorkerToFrontendMessageId.STEPPED:
				shapeJsonData.push(message.jsonData);
				appendSvgShapeData(message.svgData);
				
				checkStopConditions();
		}
		
		// If we're still running, then step again
		if (running) {
			stepRunner();
		}
	}
	
	/**
	 * Appends some shape result info to the current shape results.
	 */
	private function appendSvgShapeData(data:String) {
		shapeSvgData.push(data);
		
		shapesAddedText.innerHTML = Std.string(shapeCount);
		
		var data = makeSvgData();
		setSvgElement(data); // NOTE should really append shape-by-shape rather than doing the whole SVG
	}
	
	/**
	 * Sets up the initial SVG image element.
	 * @param	The code for the initial SVG element.
	 */
	private function setSvgElement(svgCode:String) {
		currentSvgContainer.innerHTML = svgCode;
	}
	
	/**
	 * Converts a HTML5 canvas to a bitmap object.
	 * @param	canvas The canvas to convert to a bitmap object.
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
	 * Converts an HTML image to a HTML5 canvas.
	 * @param	image The image to convert to a canvas.
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
	 * Creates the default bitmap image used in this demo.
	 * @return	The default bitmap image.
	 */
	private function createDefaultBitmap():Bitmap {
		return canvasToBitmap(imageToCanvas(defaultImageElement));
	}
	
	/**
	 * Resets things when target image is changed.
	 */
	private function onTargetImageChanged():Void {
		var backgroundColor:Rgba = Util.getAverageImageColor(targetImage); // Alpha is based off the user preference (read from a slider)
		var premultipliedColor:Rgba = Rgba.create(Std.int(backgroundColor.r * initialBackgroundOpacity / 255.0), Std.int(backgroundColor.g * initialBackgroundOpacity / 255.0), Std.int(backgroundColor.b * initialBackgroundOpacity / 255.0), Std.int(initialBackgroundOpacity));
		var backgroundRect = new Rectangle(targetImage.width, targetImage.height);
		backgroundRect.x1 = 0;
		backgroundRect.y1 = 0;
		backgroundRect.x2 = targetImage.width - 1;
		backgroundRect.y2 = targetImage.height - 1;
		
		shapeSvgData = [];
		shapeJsonData = [];
		appendSvgShapeData(SvgExporter.exportShape({ score : 0.0, color: premultipliedColor, shape: backgroundRect }));
		shapeJsonData.push(ShapeJsonExporter.exportShape({ score : 0.0, color: premultipliedColor, shape: backgroundRect }));
		
		setupWorker();
		worker.postMessage({ id : FrontendToWorkerMessageId.SET_TARGET_IMAGE, data: targetImage });
		// Kick the runner off
		if(running) {
			stepRunner();
		}
	}
	
	/**
	 * Creates the SVG data for the current set of generated shapes
	 * @return A string representing an SVG of a geometrized image
	 */
	private function makeSvgData():String {
		return SvgExporter.getSvgPrelude() + SvgExporter.getSvgNodeOpen(targetImage.width, targetImage.height) + shapeSvgData + SvgExporter.getSvgNodeClose();
	}
	
	private function set_running(running:Bool):Bool {
		runPauseButton.innerHTML = (running ? "<h2>Pause</h2>" : "<h2>Run</h2>");
		
		var wasRunning:Bool = this.running;
		this.running = running;
		
		if (!wasRunning && this.running) {
			stepRunner(); // If we were paused previously, then kick the runner off
		}
		
		return this.running;
	}
}

#end