package;

import haxe.io.Float32Array;
import js.Browser;
import js.html.CanvasElement;

/**
 * Helper functions for manipulating HTML5 canvas data.
 * @author Sam Twidale (https://www.geometrize.co.uk/)
 */
class CanvasTools {
	/**
	 * Based on http://stackoverflow.com/a/19144434/1333253 by GameAlchemist
	 * Scales the canvas down, 0 < scale < 1, and returns a new canvas containing the scaled image.
	 * @param	cv	The canvas to scale down.
	 * @param	scale	The canvas scale factor.
	 * @return	The scaled down canvas.
	 */
	public static function downScaleCanvas(cv:Dynamic, scale:Float):CanvasElement {
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