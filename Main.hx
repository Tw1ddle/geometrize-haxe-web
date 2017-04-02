package;

import js.Browser;
import js.html.Element;
import js.html.SelectElement;
import primitive.bitmap.Bitmap;
import primitive.runner.ImageRunner;
import primitive.runner.ImageRunnerOptions;
import primitive.shape.ShapeType;

// Automatic HTML code completion, you need to point these to your debug/release HTML
#if debug
@:build(CodeCompletion.buildLocalFile("bin/debug/index.html"))
#else
@:build(CodeCompletion.buildLocalFile("bin/release/index.html"))
#end
//@:build(CodeCompletion.buildUrl("http://www.samcodes.co.uk/project/primitive-haxe/"))
class ID {}

/**
 * @author Sam Twidale (http://www.samcodes.co.uk/)
 */
class Main {
	private static inline var WEBSITE_URL:String = "http://www.samcodes.co.uk/project/primitive-haxe/"; // Hosted demo URL

	private var runner:ImageRunner; // The image runner reproduces an image as geometric primitives
	private var inputImage:Bitmap; // A bitmap representation of the image to geometrize

	private var shapeTypes:ArraySet<ShapeType>;
	private var shapeAlpha:Int;
	private var candidateShapesPerStep:Int;
	private var shapeMutationsPerStep:Int;
	private var reducedSearchRepeats:Int;

	private static function main():Void {
		var main = new Main();
	}

	private inline function new() {
		// Wait for the window to load before creating the sliders, listening for input etc
		Browser.window.onload = onWindowLoaded;
	}

	private inline function onWindowLoaded():Void {
		reset();
		createSliders();
		addEventListeners();
	}

	private inline function constructRunnerOptions():ImageRunnerOptions {
		return new ImageRunnerOptions(shapeTypes, shapeAlpha, reducedSearchRepeats, candidateShapesPerStep, shapeMutationsPerStep);
	}

	private inline function reset():Void {
		// Reset the runner options
		shapeTypes = ArraySet.create([ShapeType.CIRCLE]);
		shapeAlpha = 128;
		reducedSearchRepeats = 1;
		candidateShapesPerStep = 50;
		shapeMutationsPerStep = 100;
		
		// Recreate the image runner
		runner = new ImageRunner(inputImage);
	}

	/*
	 * Create the settings sliders that go on the page
	 */
	private inline function createSliders():Void {
		/*
		NoUiSlider.create(orderElement, {
			start: [ order ],
			connect: 'lower',
			range: {
				'min': [ 1, 1 ],
				'max': [ 9 ]
			},
			pips: {
				mode: 'range',
				density: 10,
			}
		});
		createTooltips(orderElement);
		untyped orderElement.noUiSlider.on(UiSliderEvent.CHANGE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			order = Std.int(values[handle]);
		});
		untyped orderElement.noUiSlider.on(UiSliderEvent.UPDATE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			updateTooltips(orderElement, handle, Std.int(values[handle]));
		});
		
		NoUiSlider.create(maxWordsToGenerateElement, {
			start: [ 100 ],
			connect: 'lower',
			range: {
				'min': 20,
				'max': 1000
			},
			pips: {
				mode: 'range',
				density: 10,
				format: new WNumb( {
					decimals: 0
				})
			}
		});
		createTooltips(maxWordsToGenerateElement);
		untyped maxWordsToGenerateElement.noUiSlider.on(UiSliderEvent.CHANGE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			maxWordsToGenerate = Std.parseFloat(untyped values[handle]);
		});
		untyped maxWordsToGenerateElement.noUiSlider.on(UiSliderEvent.UPDATE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			updateTooltips(maxWordsToGenerateElement, handle, Std.int(values[handle]));
		});

		NoUiSlider.create(maxProcessingTimeElement, {
			start: [ maxProcessingTime ],
			connect: 'lower',
			range: {
				'min': 50,
				'max': 5000
			},
			pips: {
				mode: 'range',
				density: 10,
				format: new WNumb( {
					decimals: 0
				})
			}
		});
		createTooltips(maxProcessingTimeElement);
		untyped maxProcessingTimeElement.noUiSlider.on(UiSliderEvent.CHANGE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			maxProcessingTime = Std.parseFloat(untyped values[handle]);
		});
		untyped maxProcessingTimeElement.noUiSlider.on(UiSliderEvent.UPDATE, function(values:Array<Float>, handle:Int, rawValues:Array<Float>):Void {
			updateTooltips(maxProcessingTimeElement, handle, Std.int(values[handle]));
		});
		*/
	}

	/*
	 * Add event listeners to the input elements, in order to update the values we feed the model when "generate" is pressed
	 */
	private inline function addEventListeners():Void {
		//nameDataPresetListElement.addEventListener("change", function() {

		//}, false);

		//randomThemeElement.addEventListener("click", function() {

		//}, false);
	}

	/*
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

	/*
	 * Helper method to update the tooltips on the sliders
	 */
	private function updateTooltips(slider:Element, handleIdx:Int, value:Float):Void {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		tipHandles[handleIdx].innerHTML = "<span class='tooltip'>" + Std.string(value) + "</span>";
	}
}