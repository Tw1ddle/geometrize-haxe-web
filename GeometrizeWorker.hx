package;

#if geometrize_frontend

/**
 * Names required for the Geometrize web worker script. Used by a web worker created by the frontend.
 * @author Sam Twidale (https://www.samcodes.co.uk/)
 */
class GeometrizeWorker {
	public static inline var scriptPath:String = "js/geometrize_worker.js";
}

#end

#if geometrize_worker

import geometrize.Util;
import geometrize.Model.ShapeResult;
import geometrize.bitmap.Bitmap;
import geometrize.exporter.ShapeJsonExporter;
import geometrize.exporter.SvgExporter;
import geometrize.runner.ImageRunner;
import geometrize.runner.ImageRunnerOptions;
import js.html.Worker;

import GeometrizeWorkerMessages;

/**
 * Web worker used to offload most of the geometrizing work to a thread that won't block the UI.
 * @author Sam Twidale (https://www.geometrize.co.uk/)
 */
@:keep
class GeometrizeWorker {
	private var runner:ImageRunner; // The image runner that reproduces an image with geometric primitives
	
	public static function __init__() {
		untyped __js__("onmessage = GeometrizeWorker.prototype.messageHandler");
	}

	/**
	 * Handles a message sent from the Geometrize app frontend.
	 * @param	event The event sent from the frontend. Has a message id and data.
	 */
	public function messageHandler(event:Dynamic) {
		if (event == null || event.data == null) {
			return;
		}
		var message:Dynamic = event.data;
		
		// Process the message
		switch(message.id) {
			case FrontendToWorkerMessageId.SET_TARGET_IMAGE:
				// Set the target image and send back an acknowledgement
				var target:Bitmap = message.data;
				runner = new ImageRunner(target, Util.getAverageImageColor(target));
				postMessage({ id: WorkerToFrontendMessageId.DID_SET_TARGET_IMAGE });
			case FrontendToWorkerMessageId.STEP:
				// Step the image runner and send back the SVG data for the shapes produced
				var options:ImageRunnerOptions = message.data;
				var results:Array<ShapeResult> = runner.step(options);
				var svgData:String = SvgExporter.exportShapes(results);
				var jsonData:String = ShapeJsonExporter.exportShapes(results);
				postMessage({ id: WorkerToFrontendMessageId.STEPPED, svgData: svgData, jsonData: jsonData });
		}
	}
	
	public function postMessage(message:WorkerToFrontendMessage) {}
}

#end