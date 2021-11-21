package;

#if geometrize_frontend

import js.html.Worker;

import GeometrizeWorkerMessages;

/**
 * Wrapper class for handling and communicating with a web worker that runs the Geometrize worker script.
 * @author Sam Twidale (https://www.geometrize.co.uk/)
 */
class GeometrizeWorkerInterface {
	private var worker:Worker;
	
	/**
	 * Creates a new web worker that runs the Geometrize worker script.
	 */
	public function new() {
		worker = new Worker(GeometrizeWorker.scriptPath);
		
		worker.onmessage = function(message:Dynamic) {
			onMessage(message.data);
		}
	}
	
	/**
	 * Posts a message to the Geometrize web worker.
	 * @param	message The message to post to the web worker.
	 */
	public function postMessage(message:FrontendToWorkerMessage):Void {
		worker.postMessage(message);
	}
	
	/**
	 * Terminates the web worker.
	 */
	public function terminate():Void {
		worker.terminate();
	}
	
	/**
	 * Called when a message is received from the web worker - rebind this method to provide your own handler method.
	 * @param	message The message received from the web worker.
	 */
	dynamic public function onMessage(message:WorkerToFrontendMessage):Void {}
}

#end