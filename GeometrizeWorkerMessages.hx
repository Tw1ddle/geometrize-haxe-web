package;

import geometrize.runner.ImageRunner;
import geometrize.runner.ImageRunnerOptions;

/**
 * Ids for messages that are sent from the frontend to the Geometrize web worker.
 * @author Sam Twidale (https://www.geometrize.co.uk/)
 */
@:enum abstract FrontendToWorkerMessageId(String)
{
	var SET_TARGET_IMAGE = "should_set_target_image";
	var STEP = "should_step";
}

typedef FrontendToWorkerMessage = {
	var id:FrontendToWorkerMessageId;
	var data:Dynamic;
}

/**
 * Ids for messages that are sent from the Geometrize web worker to the frontend.
 * @author Sam Twidale (https://www.geometrize.co.uk/)
 */
@:enum abstract WorkerToFrontendMessageId(String)
{
	var DID_SET_TARGET_IMAGE = "did_set_target_image";
	var STEPPED = "did_step";
}

typedef WorkerToFrontendMessage = {
	var id:WorkerToFrontendMessageId;
	@:optional var jsonData:String;
	@:optional var svgData:String;
}