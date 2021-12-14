(function ($hx_exports, $global) { "use strict";
$hx_exports["geometrize"] = $hx_exports["geometrize"] || {};
$hx_exports["geometrize"]["bitmap"] = $hx_exports["geometrize"]["bitmap"] || {};
;$hx_exports["geometrize"]["exporter"] = $hx_exports["geometrize"]["exporter"] || {};
;$hx_exports["geometrize"]["runner"] = $hx_exports["geometrize"]["runner"] || {};
;$hx_exports["geometrize"]["shape"] = $hx_exports["geometrize"]["shape"] || {};
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var CanvasTools = function() { };
CanvasTools.__name__ = true;
CanvasTools.downScaleCanvas = function(cv,scale) {
	if(scale <= 0.0 || scale >= 1.0) {
		throw haxe_Exception.thrown("Scale must be a positive number < 1");
	}
	var sqScale = scale * scale;
	var sw = cv.width;
	var sh = cv.height;
	var tw = sw * scale | 0;
	var th = sh * scale | 0;
	var sx = 0;
	var sy = 0;
	var sIndex = 0;
	var tx = 0;
	var ty = 0;
	var yIndex = 0;
	var tIndex = 0;
	var tX = 0;
	var tY = 0;
	var w = 0.0;
	var nw = 0.0;
	var wx = 0.0;
	var nwx = 0.0;
	var wy = 0.0;
	var nwy = 0.0;
	var crossX = false;
	var crossY = false;
	var sBuffer = cv.getContext("2d").getImageData(0,0,sw,sh).data;
	var this1 = new Float32Array(3 * tw * th);
	var tBuffer = this1;
	var sR = 0.0;
	var sG = 0.0;
	var sB = 0.0;
	while(sy < sh) {
		ty = sy * scale | 0;
		tY = ty | 0;
		yIndex = 3 * tY * tw | 0;
		crossY = tY != (ty + scale | 0);
		if(crossY) {
			wy = tY + 1 - ty;
			nwy = ty + scale - tY - 1;
		}
		sx = 0;
		while(sx < sw) {
			tx = sx * scale | 0;
			tX = tx | 0;
			tIndex = yIndex + tX * 3 | 0;
			crossX = tX != Math.floor(tx + scale);
			if(crossX) {
				wx = tX + 1 - tx;
				nwx = tx + scale - tX - 1 | 0;
			}
			sR = sBuffer[sIndex];
			sG = sBuffer[sIndex + 1];
			sB = sBuffer[sIndex + 2];
			if(!crossX && !crossY) {
				tBuffer[tIndex] += sR * sqScale;
				tBuffer[tIndex + 1] += sG * sqScale;
				tBuffer[tIndex + 2] += sB * sqScale;
			} else if(crossX && !crossY) {
				w = wx * scale;
				tBuffer[tIndex] += sR * w;
				tBuffer[tIndex + 1] += sG * w;
				tBuffer[tIndex + 2] += sB * w;
				nw = nwx * scale;
				tBuffer[tIndex + 3] += sR * nw;
				tBuffer[tIndex + 4] += sG * nw;
				tBuffer[tIndex + 5] += sB * nw;
			} else if(crossY && !crossX) {
				w = wy * scale;
				tBuffer[tIndex] += sR * w;
				tBuffer[tIndex + 1] += sG * w;
				tBuffer[tIndex + 2] += sB * w;
				nw = nwy * scale;
				tBuffer[tIndex + 3 * tw] += sR * nw;
				tBuffer[tIndex + 3 * tw + 1] += sG * nw;
				tBuffer[tIndex + 3 * tw + 2] += sB * nw;
			} else {
				w = wx * wy;
				tBuffer[tIndex] += sR * w;
				tBuffer[tIndex + 1] += sG * w;
				tBuffer[tIndex + 2] += sB * w;
				nw = nwx * wy;
				tBuffer[tIndex + 3] += sR * nw;
				tBuffer[tIndex + 4] += sG * nw;
				tBuffer[tIndex + 5] += sB * nw;
				nw = wx * nwy;
				tBuffer[tIndex + 3 * tw] += sR * nw;
				tBuffer[tIndex + 3 * tw + 1] += sG * nw;
				tBuffer[tIndex + 3 * tw + 2] += sB * nw;
				nw = nwx * nwy;
				tBuffer[tIndex + 3 * tw + 3] += sR * nw;
				tBuffer[tIndex + 3 * tw + 4] += sG * nw;
				tBuffer[tIndex + 3 * tw + 5] += sB * nw;
			}
			sIndex += 4;
			++sx;
		}
		++sy;
	}
	var result = window.document.createElement("canvas");
	result.width = tw;
	result.height = th;
	var resultContext = result.getContext("2d");
	var resultImage = resultContext.getImageData(0,0,tw,th);
	var tByteBuffer = resultImage.data;
	var pxIndex = 0;
	sIndex = 0;
	tIndex = 0;
	while(pxIndex < tw * th) {
		tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
		tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
		tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
		tByteBuffer[tIndex + 3] = 255;
		sIndex += 3;
		tIndex += 4;
		++pxIndex;
	}
	resultContext.putImageData(resultImage,0,0);
	return result;
};
var GeometrizeWorkerInterface = function() {
	var _gthis = this;
	this.worker = new Worker("js/geometrize_worker.js");
	this.worker.onmessage = function(message) {
		_gthis.onMessage(message.data);
	};
};
GeometrizeWorkerInterface.__name__ = true;
GeometrizeWorkerInterface.prototype = {
	postMessage: function(message) {
		this.worker.postMessage(message);
	}
	,terminate: function() {
		this.worker.terminate();
	}
	,onMessage: function(message) {
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
var Main = function() {
	this.targetImage = null;
	this.shapeJsonData = [];
	this.shapeSvgData = [];
	this.shapeMutationsPerStep = 100;
	this.candidateShapesPerStep = 50;
	this.initialBackgroundOpacity = 255;
	this.shapeOpacity = 128;
	this.shapeTypes = geometrize_ArraySet.create([4]);
	this.maxInputImageSize = 768;
	window.onload = $bind(this,this.onWindowLoaded);
};
Main.__name__ = true;
Main.main = function() {
	var main = new Main();
};
Main.prototype = {
	get_shapeCount: function() {
		return this.shapeSvgData.length;
	}
	,get_maxShapeCountLimit: function() {
		var text = Main.maxShapesCapTextEdit.value;
		var value = Std.parseInt(text);
		if(value != null) {
			return value;
		}
		return 3000;
	}
	,set_maxShapeCountLimit: function(limit) {
		Main.maxShapesCapTextEdit.value = limit == null ? "null" : "" + limit;
		return limit;
	}
	,onWindowLoaded: function() {
		Main.rotatedEllipsesCheckbox.checked = true;
		var _gthis = this;
		noUiSlider.create(Main.shapeOpacitySlider,{ start : [this.shapeOpacity], connect : "lower", range : { "min" : [1,1], "max" : [255]}, pips : { mode : "range", density : 10}});
		this.createTooltips(Main.shapeOpacitySlider);
		Main.shapeOpacitySlider.noUiSlider.on("change",function(values,handle,rawValues) {
			_gthis.shapeOpacity = values[handle] | 0;
		});
		Main.shapeOpacitySlider.noUiSlider.on("update",function(values,handle,rawValues) {
			_gthis.updateTooltips(Main.shapeOpacitySlider,handle,values[handle] | 0);
		});
		noUiSlider.create(Main.initialBackgroundOpacitySlider,{ start : [this.initialBackgroundOpacity], connect : "lower", range : { "min" : [0,1], "max" : [255]}, pips : { mode : "range", density : 10}});
		this.createTooltips(Main.initialBackgroundOpacitySlider);
		Main.initialBackgroundOpacitySlider.noUiSlider.on("change",function(values,handle,rawValues) {
			_gthis.initialBackgroundOpacity = values[handle] | 0;
		});
		Main.initialBackgroundOpacitySlider.noUiSlider.on("update",function(values,handle,rawValues) {
			_gthis.updateTooltips(Main.initialBackgroundOpacitySlider,handle,values[handle] | 0);
		});
		noUiSlider.create(Main.randomShapesPerStepSlider,{ start : [this.candidateShapesPerStep], connect : "lower", range : { "min" : [10,1], "max" : [300]}, pips : { mode : "range", density : 10}});
		this.createTooltips(Main.randomShapesPerStepSlider);
		Main.randomShapesPerStepSlider.noUiSlider.on("change",function(values,handle,rawValues) {
			_gthis.candidateShapesPerStep = values[handle] | 0;
		});
		Main.randomShapesPerStepSlider.noUiSlider.on("update",function(values,handle,rawValues) {
			_gthis.updateTooltips(Main.randomShapesPerStepSlider,handle,values[handle] | 0);
		});
		noUiSlider.create(Main.shapeMutationsPerStepSlider,{ start : [this.shapeMutationsPerStep], connect : "lower", range : { "min" : [10,1], "max" : [300]}, pips : { mode : "range", density : 10}});
		this.createTooltips(Main.shapeMutationsPerStepSlider);
		Main.shapeMutationsPerStepSlider.noUiSlider.on("change",function(values,handle,rawValues) {
			_gthis.shapeMutationsPerStep = values[handle] | 0;
		});
		Main.shapeMutationsPerStepSlider.noUiSlider.on("update",function(values,handle,rawValues) {
			_gthis.updateTooltips(Main.shapeMutationsPerStepSlider,handle,values[handle] | 0);
		});
		var _gthis1 = this;
		Main.runPauseButton.addEventListener("click",function() {
			_gthis1.set_running(!_gthis1.running);
		},false);
		Main.openImageFileInput.addEventListener("change",function(e) {
			if(Main.openImageFileInput.files == null || Main.openImageFileInput.files.length == 0) {
				return;
			}
			var file = Main.openImageFileInput.files[0];
			var fileReader = new FileReader();
			fileReader.onload = function(e) {
				var image = new Image();
				image.onload = function(e) {
					var canvas = _gthis1.imageToCanvas(image);
					while(canvas.width > _gthis1.maxInputImageSize || canvas.height > _gthis1.maxInputImageSize) canvas = CanvasTools.downScaleCanvas(canvas,0.5);
					_gthis1.targetImage = _gthis1.canvasToBitmap(canvas);
					_gthis1.onTargetImageChanged();
				};
				image.src = fileReader.result;
			};
			fileReader.readAsDataURL(file);
			Main.openImageFileInput.files[0] = null;
		},false);
		Main.stepButton.addEventListener("click",function() {
			_gthis1.stepRunner();
		},false);
		Main.randomImageButton.addEventListener("click",function() {
			var image = new Image();
			image.onload = function() {
				Main.sampleImagesContainer.appendChild(image);
				var _gthis = _gthis1;
				var tmp = _gthis1.imageToCanvas(image);
				_gthis1.targetImage = _gthis.canvasToBitmap(tmp);
				_gthis1.onTargetImageChanged();
			};
			var tmp = Main.imagesToGeometrize;
			var tmp1 = Math.floor(Math.random() * Main.imagesToGeometrize.length);
			image.src = tmp[tmp1];
		},false);
		Main.resetButton.addEventListener("click",function() {
			_gthis1.targetImage = _gthis1.targetImage;
			_gthis1.onTargetImageChanged();
		},false);
		Main.saveImageButton.addEventListener("click",function(e) {
			var svgData = "data:image/svg+xml;base64," + window.btoa(_gthis1.makeSvgData());
			var svgImage = new Image();
			svgImage.onload = function() {
				var canvas = _gthis1.imageToCanvas(svgImage);
				if(canvas.msToBlob != null) {
					var blob = canvas.msToBlob();
					var navigator = window.navigator;
					navigator.msSaveBlob(blob,"geometrized_image.png");
				} else {
					var data = canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
					var tempLink = window.document.createElement("a");
					tempLink.href = data;
					tempLink.download = "geometrized_image.png";
					window.document.body.appendChild(tempLink);
					tempLink.click();
					window.document.body.removeChild(tempLink);
				}
			};
			svgImage.setAttribute("src",svgData);
		},false);
		var saveBlob = function(data,dataType,filename,anchor) {
			var blob = new Blob([data],{ type : dataType});
			var navigator = window.navigator;
			if(navigator.msSaveBlob != null) {
				navigator.msSaveBlob(blob,filename);
			} else {
				var dataUrl = URL.createObjectURL(blob);
				anchor.download = filename;
				anchor.href = dataUrl;
			}
		};
		Main.saveSvgButton.addEventListener("click",function(e) {
			saveBlob(Main.currentSvgContainer.innerHTML,"image/svg+xml;charset=utf-8","geometrized_svg.svg",Main.saveSvgButton);
		},false);
		Main.saveJsonButton.addEventListener("click",function(e) {
			saveBlob("[\r\n" + _gthis1.shapeJsonData.join(",\r\n") + "\r\n]","data:text/json;charset=utf-8","geometrized_json.json",Main.saveJsonButton);
		},false);
		var setShapeOption = function(option,enable) {
			if(enable) {
				geometrize_ArraySet.add(_gthis1.shapeTypes,option);
			} else {
				HxOverrides.remove(_gthis1.shapeTypes,option);
			}
		};
		Main.rectanglesCheckbox.addEventListener("click",function() {
			setShapeOption(0,Main.rectanglesCheckbox.checked);
		},false);
		Main.rotatedRectanglesCheckbox.addEventListener("click",function() {
			setShapeOption(1,Main.rotatedRectanglesCheckbox.checked);
		},false);
		Main.trianglesCheckbox.addEventListener("click",function() {
			setShapeOption(2,Main.trianglesCheckbox.checked);
		},false);
		Main.ellipsesCheckbox.addEventListener("click",function() {
			setShapeOption(3,Main.ellipsesCheckbox.checked);
		},false);
		Main.rotatedEllipsesCheckbox.addEventListener("click",function() {
			setShapeOption(4,Main.rotatedEllipsesCheckbox.checked);
		},false);
		Main.circlesCheckbox.addEventListener("click",function() {
			setShapeOption(5,Main.circlesCheckbox.checked);
		},false);
		Main.linesCheckbox.addEventListener("click",function() {
			setShapeOption(6,Main.linesCheckbox.checked);
		},false);
		Main.quadraticBeziersCheckbox.addEventListener("click",function() {
			setShapeOption(7,Main.quadraticBeziersCheckbox.checked);
		},false);
		this.set_maxShapeCountLimit(3000);
		if(this.worker != null) {
			this.worker.terminate();
		}
		this.worker = new GeometrizeWorkerInterface();
		this.worker.onMessage = $bind(this,this.onWorkerMessageReceived);
		this.targetImage = this.createDefaultBitmap();
		this.onTargetImageChanged();
		this.set_running(true);
	}
	,createTooltips: function(slider) {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		var _g = 0;
		var _g1 = tipHandles.length;
		while(_g < _g1) {
			var i = _g++;
			var div = window.document.createElement("div");
			div.className += "tooltip";
			tipHandles[i].appendChild(div);
			this.updateTooltips(slider,i,0);
		}
	}
	,updateTooltips: function(slider,handleIdx,value) {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		tipHandles[handleIdx].innerHTML = "<span class='tooltip'>" + (value == null ? "null" : "" + value) + "</span>";
	}
	,checkStopConditions: function() {
		if(this.get_shapeCount() >= this.get_maxShapeCountLimit()) {
			this.set_running(false);
		}
	}
	,stepRunner: function() {
		var options = { shapeTypes : this.shapeTypes.length == 0 ? [2] : geometrize_ArraySet.toArray(this.shapeTypes), alpha : this.shapeOpacity | 0, candidateShapesPerStep : this.candidateShapesPerStep, shapeMutationsPerStep : this.shapeMutationsPerStep};
		this.worker.postMessage({ id : "should_step", data : options});
	}
	,onWorkerMessageReceived: function(message) {
		switch(message.id) {
		case "did_set_target_image":
			break;
		case "did_step":
			this.shapeJsonData.push(message.jsonData);
			this.appendSvgShapeData(message.svgData);
			this.checkStopConditions();
			break;
		}
		if(this.running) {
			this.stepRunner();
		}
	}
	,appendSvgShapeData: function(data) {
		this.shapeSvgData.push(data);
		var tmp = this.get_shapeCount();
		Main.shapesAddedText.innerHTML = Std.string(tmp);
		var data = this.makeSvgData();
		this.setSvgElement(data);
	}
	,setSvgElement: function(svgCode) {
		Main.currentSvgContainer.innerHTML = svgCode;
	}
	,canvasToBitmap: function(canvas) {
		var context = canvas.getContext("2d",null);
		var imageData = context.getImageData(0,0,canvas.width,canvas.height);
		var bytesData = new haxe_io_Bytes(new ArrayBuffer(imageData.data.length));
		var _g = 0;
		var _g1 = bytesData.length;
		while(_g < _g1) {
			var i = _g++;
			bytesData.b[i] = imageData.data[i];
		}
		var w = canvas.width;
		var h = canvas.height;
		var bitmap = new geometrize_bitmap_Bitmap();
		if(bytesData == null) {
			throw haxe_Exception.thrown("FAIL: bytes != null");
		}
		var actual = bytesData.length;
		var expected = w * h * 4;
		if(actual != expected) {
			throw haxe_Exception.thrown("FAIL: values are not equal (expected: " + expected + ", actual: " + actual + ")");
		}
		bitmap.width = w;
		bitmap.height = h;
		var this1 = new Array(bytesData.length / 4 | 0);
		bitmap.data = this1;
		var i = 0;
		var x = 0;
		while(i < bytesData.length) {
			var red = bytesData.b[i];
			var green = bytesData.b[i + 1];
			var blue = bytesData.b[i + 2];
			var alpha = bytesData.b[i + 3];
			bitmap.data[x] = ((red < 0 ? 0 : red > 255 ? 255 : red) << 24) + ((green < 0 ? 0 : green > 255 ? 255 : green) << 16) + ((blue < 0 ? 0 : blue > 255 ? 255 : blue) << 8) + (alpha < 0 ? 0 : alpha > 255 ? 255 : alpha);
			i += 4;
			++x;
		}
		var bitmap1 = bitmap;
		return bitmap1;
	}
	,imageToCanvas: function(image) {
		var canvas = window.document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		var context = canvas.getContext("2d",null);
		context.drawImage(image,0,0);
		return canvas;
	}
	,createDefaultBitmap: function() {
		return this.canvasToBitmap(this.imageToCanvas(Main.defaultImageElement));
	}
	,onTargetImageChanged: function() {
		var backgroundColor = geometrize_Util.getAverageImageColor(this.targetImage);
		var red = (backgroundColor >> 24 & 255) * this.initialBackgroundOpacity / 255.0 | 0;
		var green = (backgroundColor >> 16 & 255) * this.initialBackgroundOpacity / 255.0 | 0;
		var blue = (backgroundColor >> 8 & 255) * this.initialBackgroundOpacity / 255.0 | 0;
		var alpha = this.initialBackgroundOpacity | 0;
		var premultipliedColor = ((red < 0 ? 0 : red > 255 ? 255 : red) << 24) + ((green < 0 ? 0 : green > 255 ? 255 : green) << 16) + ((blue < 0 ? 0 : blue > 255 ? 255 : blue) << 8) + (alpha < 0 ? 0 : alpha > 255 ? 255 : alpha);
		var backgroundRect = new geometrize_shape_Rectangle(this.targetImage.width,this.targetImage.height);
		backgroundRect.x1 = 0;
		backgroundRect.y1 = 0;
		backgroundRect.x2 = this.targetImage.width - 1;
		backgroundRect.y2 = this.targetImage.height - 1;
		this.shapeSvgData = [];
		this.shapeJsonData = [];
		this.appendSvgShapeData(geometrize_exporter_SvgExporter.exportShape({ score : 0.0, color : premultipliedColor, shape : backgroundRect}));
		this.shapeJsonData.push(geometrize_exporter_ShapeJsonExporter.exportShape({ score : 0.0, color : premultipliedColor, shape : backgroundRect}));
		if(this.worker != null) {
			this.worker.terminate();
		}
		this.worker = new GeometrizeWorkerInterface();
		this.worker.onMessage = $bind(this,this.onWorkerMessageReceived);
		this.worker.postMessage({ id : "should_set_target_image", data : this.targetImage});
		if(this.running) {
			this.stepRunner();
		}
	}
	,makeSvgData: function() {
		return geometrize_exporter_SvgExporter.getSvgPrelude() + geometrize_exporter_SvgExporter.getSvgNodeOpen(this.targetImage.width,this.targetImage.height) + Std.string(this.shapeSvgData) + geometrize_exporter_SvgExporter.getSvgNodeClose();
	}
	,set_running: function(running) {
		Main.runPauseButton.innerHTML = running ? "<h2>Pause</h2>" : "<h2>Run</h2>";
		var wasRunning = this.running;
		this.running = running;
		if(!wasRunning && this.running) {
			this.stepRunner();
		}
		return this.running;
	}
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var UInt = {};
UInt.toFloat = function(this1) {
	var int = this1;
	if(int < 0) {
		return 4294967296.0 + int;
	} else {
		return int + 0.0;
	}
};
var geometrize_ArraySet = {};
geometrize_ArraySet.create = function(array) {
	if(array == null) {
		var this1 = [];
		return this1;
	}
	return geometrize_ArraySet.toSet(array);
};
geometrize_ArraySet.add = function(this1,element) {
	if(element == null) {
		throw haxe_Exception.thrown("FAIL: element != null");
	}
	if(geometrize_ArraySet.contains(this1,element)) {
		return false;
	}
	this1.push(element);
	return true;
};
geometrize_ArraySet.contains = function(this1,element) {
	var _g = 0;
	while(_g < this1.length) {
		var i = this1[_g];
		++_g;
		if(i == element) {
			return true;
		}
	}
	return false;
};
geometrize_ArraySet.toArray = function(this1) {
	return this1.slice();
};
geometrize_ArraySet.toSet = function(array) {
	var this1 = [];
	var set = this1;
	var _g = 0;
	while(_g < array.length) {
		var v = array[_g];
		++_g;
		geometrize_ArraySet.add(set,v);
	}
	return set;
};
var geometrize_Core = function() { };
geometrize_Core.__name__ = true;
geometrize_Core.computeColor = function(target,current,lines,alpha) {
	if(target == null) {
		throw haxe_Exception.thrown("FAIL: target != null");
	}
	if(current == null) {
		throw haxe_Exception.thrown("FAIL: current != null");
	}
	if(lines == null) {
		throw haxe_Exception.thrown("FAIL: lines != null");
	}
	if(alpha < 0) {
		throw haxe_Exception.thrown("FAIL: alpha >= 0");
	}
	var totalRed = 0;
	var totalGreen = 0;
	var totalBlue = 0;
	var count = 0;
	var f = 65535 / alpha;
	var a = f | 0;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		var y = line.y;
		var _g1 = line.x1;
		var _g2 = line.x2 + 1;
		while(_g1 < _g2) {
			var x = _g1++;
			var t = target.data[target.width * y + x];
			var c = current.data[current.width * y + x];
			totalRed += ((t >> 24 & 255) - (c >> 24 & 255)) * a + (c >> 24 & 255) * 257;
			totalGreen += ((t >> 16 & 255) - (c >> 16 & 255)) * a + (c >> 16 & 255) * 257;
			totalBlue += ((t >> 8 & 255) - (c >> 8 & 255)) * a + (c >> 8 & 255) * 257;
			++count;
		}
	}
	if(count == 0) {
		return 0;
	}
	var value = (totalRed / count | 0) >> 8;
	var r = value < 0 ? 0 : value > 255 ? 255 : value;
	var value = (totalGreen / count | 0) >> 8;
	var g = value < 0 ? 0 : value > 255 ? 255 : value;
	var value = (totalBlue / count | 0) >> 8;
	var b = value < 0 ? 0 : value > 255 ? 255 : value;
	return ((r < 0 ? 0 : r > 255 ? 255 : r) << 24) + ((g < 0 ? 0 : g > 255 ? 255 : g) << 16) + ((b < 0 ? 0 : b > 255 ? 255 : b) << 8) + (alpha < 0 ? 0 : alpha > 255 ? 255 : alpha);
};
geometrize_Core.differenceFull = function(first,second) {
	if(first == null) {
		throw haxe_Exception.thrown("FAIL: first != null");
	}
	if(second == null) {
		throw haxe_Exception.thrown("FAIL: second != null");
	}
	if(first.width == 0) {
		throw haxe_Exception.thrown("FAIL: first.width != 0");
	}
	if(first.height == 0) {
		throw haxe_Exception.thrown("FAIL: first.height != 0");
	}
	if(second.width == 0) {
		throw haxe_Exception.thrown("FAIL: second.width != 0");
	}
	if(second.height == 0) {
		throw haxe_Exception.thrown("FAIL: second.height != 0");
	}
	var actual = first.width;
	var expected = second.width;
	if(actual != expected) {
		throw haxe_Exception.thrown("FAIL: values are not equal (expected: " + expected + ", actual: " + actual + ")");
	}
	var actual = first.height;
	var expected = second.height;
	if(actual != expected) {
		throw haxe_Exception.thrown("FAIL: values are not equal (expected: " + expected + ", actual: " + actual + ")");
	}
	var total = 0;
	var width = first.width;
	var height = first.height;
	var _g = 0;
	var _g1 = height;
	while(_g < _g1) {
		var y = _g++;
		var _g2 = 0;
		var _g3 = width;
		while(_g2 < _g3) {
			var x = _g2++;
			var f = first.data[first.width * y + x];
			var s = second.data[second.width * y + x];
			var dr = (f >> 24 & 255) - (s >> 24 & 255);
			var dg = (f >> 16 & 255) - (s >> 16 & 255);
			var db = (f >> 8 & 255) - (s >> 8 & 255);
			var da = (f & 255) - (s & 255);
			total += dr * dr + dg * dg + db * db + da * da;
		}
	}
	var result = Math.sqrt(total / (width * height * 4.0)) / 255;
	if(!isFinite(result)) {
		throw haxe_Exception.thrown("FAIL: Math.isFinite(result)");
	}
	return result;
};
geometrize_Core.differencePartial = function(target,before,after,score,lines) {
	if(target == null) {
		throw haxe_Exception.thrown("FAIL: target != null");
	}
	if(before == null) {
		throw haxe_Exception.thrown("FAIL: before != null");
	}
	if(after == null) {
		throw haxe_Exception.thrown("FAIL: after != null");
	}
	if(lines == null) {
		throw haxe_Exception.thrown("FAIL: lines != null");
	}
	if(lines.length == 0) {
		throw haxe_Exception.thrown("FAIL: lines.length != 0");
	}
	var width = target.width;
	var height = target.height;
	var rgbaCount = width * height * 4;
	var total = Math.pow(score * 255,2) * rgbaCount;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		var y = line.y;
		var _g1 = line.x1;
		var _g2 = line.x2 + 1;
		while(_g1 < _g2) {
			var x = _g1++;
			var t = target.data[target.width * y + x];
			var b = before.data[before.width * y + x];
			var a = after.data[after.width * y + x];
			var dtbr = (t >> 24 & 255) - (b >> 24 & 255);
			var dtbg = (t >> 16 & 255) - (b >> 16 & 255);
			var dtbb = (t >> 8 & 255) - (b >> 8 & 255);
			var dtba = (t & 255) - (b & 255);
			var dtar = (t >> 24 & 255) - (a >> 24 & 255);
			var dtag = (t >> 16 & 255) - (a >> 16 & 255);
			var dtab = (t >> 8 & 255) - (a >> 8 & 255);
			var dtaa = (t & 255) - (a & 255);
			total -= dtbr * dtbr + dtbg * dtbg + dtbb * dtbb + dtba * dtba;
			total += dtar * dtar + dtag * dtag + dtab * dtab + dtaa * dtaa;
		}
	}
	var result = Math.sqrt(total / rgbaCount) / 255;
	if(!isFinite(result)) {
		throw haxe_Exception.thrown("FAIL: Math.isFinite(result)");
	}
	return result;
};
geometrize_Core.bestRandomState = function(shapes,alpha,n,target,current,buffer,lastScore) {
	var bestEnergy = 0;
	var bestState = null;
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		var state = new geometrize_State(geometrize_shape_ShapeFactory.randomShapeOf(shapes,current.width,current.height),alpha,target,current,buffer);
		var energy = state.energy(lastScore);
		if(i == 0 || energy < bestEnergy) {
			bestEnergy = energy;
			bestState = state;
		}
	}
	return bestState;
};
geometrize_Core.bestHillClimbState = function(shapes,alpha,n,age,target,current,buffer,lastScore) {
	var state = geometrize_Core.bestRandomState(shapes,alpha,n,target,current,buffer,lastScore);
	state = geometrize_Core.hillClimb(state,age,lastScore);
	return state;
};
geometrize_Core.hillClimb = function(state,maxAge,lastScore) {
	if(state == null) {
		throw haxe_Exception.thrown("FAIL: state != null");
	}
	if(maxAge < 0) {
		throw haxe_Exception.thrown("FAIL: maxAge >= 0");
	}
	var state1 = state.clone();
	var bestState = state1.clone();
	var bestEnergy = state1.energy(lastScore);
	var age = 0;
	while(age < maxAge) {
		var undo = state1.mutate();
		var energy = state1.energy(lastScore);
		if(energy >= bestEnergy) {
			state1 = undo;
		} else {
			bestEnergy = energy;
			bestState = state1.clone();
			age = -1;
		}
		++age;
	}
	return bestState;
};
geometrize_Core.energy = function(shape,alpha,target,current,buffer,score) {
	if(shape == null) {
		throw haxe_Exception.thrown("FAIL: shape != null");
	}
	if(target == null) {
		throw haxe_Exception.thrown("FAIL: target != null");
	}
	if(current == null) {
		throw haxe_Exception.thrown("FAIL: current != null");
	}
	if(buffer == null) {
		throw haxe_Exception.thrown("FAIL: buffer != null");
	}
	var lines = shape.rasterize();
	if(lines == null) {
		throw haxe_Exception.thrown("FAIL: lines != null");
	}
	if(lines.length == 0) {
		throw haxe_Exception.thrown("FAIL: lines.length != 0");
	}
	var color = geometrize_Core.computeColor(target,current,lines,alpha);
	geometrize_rasterizer_Rasterizer.copyLines(buffer,current,lines);
	geometrize_rasterizer_Rasterizer.drawLines(buffer,color,lines);
	return geometrize_Core.differencePartial(target,current,buffer,score,lines);
};
var geometrize_Model = function(target,backgroundColor) {
	if(target == null) {
		throw haxe_Exception.thrown("FAIL: target != null");
	}
	this.width = target.width;
	this.height = target.height;
	this.target = target;
	var w = target.width;
	var h = target.height;
	var bitmap = new geometrize_bitmap_Bitmap();
	bitmap.width = w;
	bitmap.height = h;
	var this1 = new Array(w * h);
	bitmap.data = this1;
	var i = 0;
	while(i < bitmap.data.length) {
		bitmap.data[i] = backgroundColor;
		++i;
	}
	this.current = bitmap;
	var w = target.width;
	var h = target.height;
	var bitmap = new geometrize_bitmap_Bitmap();
	bitmap.width = w;
	bitmap.height = h;
	var this1 = new Array(w * h);
	bitmap.data = this1;
	var i = 0;
	while(i < bitmap.data.length) {
		bitmap.data[i] = backgroundColor;
		++i;
	}
	this.buffer = bitmap;
	this.score = geometrize_Core.differenceFull(target,this.current);
};
geometrize_Model.__name__ = true;
geometrize_Model.prototype = {
	step: function(shapeTypes,alpha,n,age) {
		var state = geometrize_Core.bestHillClimbState(shapeTypes,alpha,n,age,this.target,this.current,this.buffer,this.score);
		var results = [this.addShape(state.shape,state.alpha)];
		return results;
	}
	,addShape: function(shape,alpha) {
		if(shape == null) {
			throw haxe_Exception.thrown("FAIL: shape != null");
		}
		var _this = this.current;
		var bitmap = new geometrize_bitmap_Bitmap();
		bitmap.width = _this.width;
		bitmap.height = _this.height;
		var this1 = new Array(_this.data.length);
		bitmap.data = this1;
		var _g = 0;
		var _g1 = _this.data.length;
		while(_g < _g1) {
			var i = _g++;
			bitmap.data[i] = _this.data[i];
		}
		var before = bitmap;
		var lines = shape.rasterize();
		var color = geometrize_Core.computeColor(this.target,this.current,lines,alpha);
		geometrize_rasterizer_Rasterizer.drawLines(this.current,color,lines);
		this.score = geometrize_Core.differencePartial(this.target,before,this.current,this.score,lines);
		var result = { score : this.score, color : color, shape : shape};
		return result;
	}
};
var geometrize_State = function(shape,alpha,target,current,buffer) {
	if(shape == null) {
		throw haxe_Exception.thrown("FAIL: shape != null");
	}
	this.shape = shape;
	this.alpha = alpha;
	this.score = -1;
	this.target = target;
	this.current = current;
	this.buffer = buffer;
};
geometrize_State.__name__ = true;
geometrize_State.prototype = {
	energy: function(lastScore) {
		if(this.score < 0) {
			this.score = geometrize_Core.energy(this.shape,this.alpha,this.target,this.current,this.buffer,lastScore);
		}
		return this.score;
	}
	,mutate: function() {
		var oldState = this.clone();
		this.shape.mutate();
		return oldState;
	}
	,clone: function() {
		return new geometrize_State(this.shape.clone(),this.alpha,this.target,this.current,this.buffer);
	}
};
var geometrize_Util = function() { };
geometrize_Util.__name__ = true;
geometrize_Util.getAverageImageColor = function(image,alpha) {
	if(alpha == null) {
		alpha = 255;
	}
	if(image == null) {
		throw haxe_Exception.thrown("FAIL: image != null");
	}
	var totalRed = 0;
	var totalGreen = 0;
	var totalBlue = 0;
	var _g = 0;
	var _g1 = image.width;
	while(_g < _g1) {
		var x = _g++;
		var _g2 = 0;
		var _g3 = image.height;
		while(_g2 < _g3) {
			var y = _g2++;
			var pixel = image.data[image.width * y + x];
			totalRed += pixel >> 24 & 255;
			totalGreen += pixel >> 16 & 255;
			totalBlue += pixel >> 8 & 255;
		}
	}
	var size = image.width * image.height;
	var red = totalRed / size | 0;
	var green = totalGreen / size | 0;
	var blue = totalBlue / size | 0;
	return ((red < 0 ? 0 : red > 255 ? 255 : red) << 24) + ((green < 0 ? 0 : green > 255 ? 255 : green) << 16) + ((blue < 0 ? 0 : blue > 255 ? 255 : blue) << 8) + (alpha < 0 ? 0 : alpha > 255 ? 255 : alpha);
};
var geometrize_bitmap_Bitmap = $hx_exports["geometrize"]["bitmap"]["Bitmap"] = function() {
};
geometrize_bitmap_Bitmap.__name__ = true;
geometrize_bitmap_Bitmap.create = function(w,h,color) {
	var bitmap = new geometrize_bitmap_Bitmap();
	bitmap.width = w;
	bitmap.height = h;
	var this1 = new Array(w * h);
	bitmap.data = this1;
	var i = 0;
	while(i < bitmap.data.length) {
		bitmap.data[i] = color;
		++i;
	}
	return bitmap;
};
geometrize_bitmap_Bitmap.createFromBytes = function(w,h,bytes) {
	var bitmap = new geometrize_bitmap_Bitmap();
	if(bytes == null) {
		throw haxe_Exception.thrown("FAIL: bytes != null");
	}
	var actual = bytes.length;
	var expected = w * h * 4;
	if(actual != expected) {
		throw haxe_Exception.thrown("FAIL: values are not equal (expected: " + expected + ", actual: " + actual + ")");
	}
	bitmap.width = w;
	bitmap.height = h;
	var this1 = new Array(bytes.length / 4 | 0);
	bitmap.data = this1;
	var i = 0;
	var x = 0;
	while(i < bytes.length) {
		var red = bytes.b[i];
		var green = bytes.b[i + 1];
		var blue = bytes.b[i + 2];
		var alpha = bytes.b[i + 3];
		bitmap.data[x] = ((red < 0 ? 0 : red > 255 ? 255 : red) << 24) + ((green < 0 ? 0 : green > 255 ? 255 : green) << 16) + ((blue < 0 ? 0 : blue > 255 ? 255 : blue) << 8) + (alpha < 0 ? 0 : alpha > 255 ? 255 : alpha);
		i += 4;
		++x;
	}
	return bitmap;
};
geometrize_bitmap_Bitmap.createFromByteArray = function(w,h,bytes) {
	var data = new haxe_io_Bytes(new ArrayBuffer(bytes.length));
	var i = 0;
	while(i < bytes.length) {
		data.b[i] = bytes[i];
		++i;
	}
	var bitmap = new geometrize_bitmap_Bitmap();
	if(data == null) {
		throw haxe_Exception.thrown("FAIL: bytes != null");
	}
	var actual = data.length;
	var expected = w * h * 4;
	if(actual != expected) {
		throw haxe_Exception.thrown("FAIL: values are not equal (expected: " + expected + ", actual: " + actual + ")");
	}
	bitmap.width = w;
	bitmap.height = h;
	var this1 = new Array(data.length / 4 | 0);
	bitmap.data = this1;
	var i = 0;
	var x = 0;
	while(i < data.length) {
		var red = data.b[i];
		var green = data.b[i + 1];
		var blue = data.b[i + 2];
		var alpha = data.b[i + 3];
		bitmap.data[x] = ((red < 0 ? 0 : red > 255 ? 255 : red) << 24) + ((green < 0 ? 0 : green > 255 ? 255 : green) << 16) + ((blue < 0 ? 0 : blue > 255 ? 255 : blue) << 8) + (alpha < 0 ? 0 : alpha > 255 ? 255 : alpha);
		i += 4;
		++x;
	}
	return bitmap;
};
geometrize_bitmap_Bitmap.prototype = {
	getPixel: function(x,y) {
		return this.data[this.width * y + x];
	}
	,setPixel: function(x,y,color) {
		this.data[this.width * y + x] = color;
	}
	,clone: function() {
		var bitmap = new geometrize_bitmap_Bitmap();
		bitmap.width = this.width;
		bitmap.height = this.height;
		var this1 = new Array(this.data.length);
		bitmap.data = this1;
		var _g = 0;
		var _g1 = this.data.length;
		while(_g < _g1) {
			var i = _g++;
			bitmap.data[i] = this.data[i];
		}
		return bitmap;
	}
	,fill: function(color) {
		var idx = 0;
		while(idx < this.data.length) {
			this.data[idx] = color >> 24 & 255;
			this.data[idx + 1] = color >> 16 & 255;
			this.data[idx + 2] = color >> 8 & 255;
			this.data[idx + 3] = color & 255;
			idx += 4;
		}
	}
	,getBytes: function() {
		var bytes = new haxe_io_Bytes(new ArrayBuffer(this.data.length * 4));
		var i = 0;
		while(i < this.data.length) {
			var idx = i * 4;
			bytes.b[idx] = this.data[i] >> 24 & 255;
			bytes.b[idx + 1] = this.data[i] >> 16 & 255;
			bytes.b[idx + 2] = this.data[i] >> 8 & 255;
			bytes.b[idx + 3] = this.data[i] & 255;
			++i;
		}
		return bytes;
	}
};
var geometrize_exporter_ShapeJsonExporter = $hx_exports["geometrize"]["exporter"]["ShapeJsonExporter"] = function() { };
geometrize_exporter_ShapeJsonExporter.__name__ = true;
geometrize_exporter_ShapeJsonExporter.export = function(shapes) {
	return "[\n" + geometrize_exporter_ShapeJsonExporter.exportShapes(shapes) + "\n]";
};
geometrize_exporter_ShapeJsonExporter.exportShapes = function(shapes) {
	var results = "";
	var _g = 0;
	var _g1 = shapes.length;
	while(_g < _g1) {
		var i = _g++;
		results += geometrize_exporter_ShapeJsonExporter.exportShape(shapes[i]);
		if(i != shapes.length - 1) {
			results += ",\n";
		}
	}
	return results;
};
geometrize_exporter_ShapeJsonExporter.exportShape = function(shape) {
	var result = "    {\n";
	var type = shape.shape.getType();
	var data = shape.shape.getRawShapeData();
	var color = shape.color;
	var score = shape.score;
	result += "        \"type\":" + type + ",\n";
	result += "        \"data\":" + "[";
	var _g = 0;
	var _g1 = data.length;
	while(_g < _g1) {
		var item = _g++;
		result += data[item];
		if(item <= data.length - 2) {
			result += ",";
		}
	}
	result += "],\n";
	result += "        \"color\":" + "[";
	result += (color >> 24 & 255) + ",";
	result += (color >> 16 & 255) + ",";
	result += (color >> 8 & 255) + ",";
	result += color & 255;
	result += "],\n";
	result += "        \"score\":" + score + "\n";
	result += "    }";
	return result;
};
var geometrize_exporter_SvgExporter = $hx_exports["geometrize"]["exporter"]["SvgExporter"] = function() { };
geometrize_exporter_SvgExporter.__name__ = true;
geometrize_exporter_SvgExporter.export = function(shapes,width,height) {
	var results = geometrize_exporter_SvgExporter.getSvgPrelude();
	results += geometrize_exporter_SvgExporter.getSvgNodeOpen(width,height);
	results += geometrize_exporter_SvgExporter.exportShapes(shapes);
	results += geometrize_exporter_SvgExporter.getSvgNodeClose();
	return results;
};
geometrize_exporter_SvgExporter.exportShapes = function(shapes) {
	var results = "";
	var _g = 0;
	var _g1 = shapes.length;
	while(_g < _g1) {
		var i = _g++;
		results += geometrize_exporter_SvgExporter.exportShape(shapes[i]);
		if(i != shapes.length - 1) {
			results += "\n";
		}
	}
	return results;
};
geometrize_exporter_SvgExporter.exportShape = function(shape) {
	return StringTools.replace(shape.shape.getSvgShapeData(),geometrize_exporter_SvgExporter.SVG_STYLE_HOOK,geometrize_exporter_SvgExporter.stylesForShape(shape));
};
geometrize_exporter_SvgExporter.getSvgPrelude = function() {
	return "<?xml version=\"1.0\" standalone=\"no\"?>\n";
};
geometrize_exporter_SvgExporter.getSvgNodeOpen = function(width,height) {
	return "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.2\" baseProfile=\"tiny\" width=\"" + width + "\" height=\"" + height + "\">\n";
};
geometrize_exporter_SvgExporter.getSvgNodeClose = function() {
	return "</svg>";
};
geometrize_exporter_SvgExporter.stylesForShape = function(shape) {
	switch(shape.shape.getType()) {
	case 6:case 7:
		return geometrize_exporter_SvgExporter.strokeForColor(shape.color) + " stroke-width=\"1\" fill=\"none\" " + geometrize_exporter_SvgExporter.strokeOpacityForAlpha(shape.color & 255);
	default:
		return geometrize_exporter_SvgExporter.fillForColor(shape.color) + " " + geometrize_exporter_SvgExporter.fillOpacityForAlpha(shape.color & 255);
	}
};
geometrize_exporter_SvgExporter.rgbForColor = function(color) {
	return "rgb(" + (color >> 24 & 255) + "," + (color >> 16 & 255) + "," + (color >> 8 & 255) + ")";
};
geometrize_exporter_SvgExporter.strokeForColor = function(color) {
	return "stroke=\"" + geometrize_exporter_SvgExporter.rgbForColor(color) + "\"";
};
geometrize_exporter_SvgExporter.fillForColor = function(color) {
	return "fill=\"" + geometrize_exporter_SvgExporter.rgbForColor(color) + "\"";
};
geometrize_exporter_SvgExporter.fillOpacityForAlpha = function(alpha) {
	return "fill-opacity=\"" + alpha / 255.0 + "\"";
};
geometrize_exporter_SvgExporter.strokeOpacityForAlpha = function(alpha) {
	return "stroke-opacity=\"" + alpha / 255.0 + "\"";
};
var geometrize_rasterizer_Rasterizer = function() { };
geometrize_rasterizer_Rasterizer.__name__ = true;
geometrize_rasterizer_Rasterizer.drawLines = function(image,c,lines) {
	if(image == null) {
		throw haxe_Exception.thrown("FAIL: image != null");
	}
	if(lines == null) {
		throw haxe_Exception.thrown("FAIL: lines != null");
	}
	var sr = c >> 24 & 255;
	sr |= sr << 8;
	sr *= c & 255;
	sr = sr / 255 | 0;
	var sg = c >> 16 & 255;
	sg |= sg << 8;
	sg *= c & 255;
	sg = sg / 255 | 0;
	var sb = c >> 8 & 255;
	sb |= sb << 8;
	sb *= c & 255;
	sb = sb / 255 | 0;
	var sa = c & 255;
	sa |= sa << 8;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		var y = line.y;
		var ma = 65535;
		var m = 65535;
		var as = (m - sa * (ma / m)) * 257;
		var a = as | 0;
		var _g1 = line.x1;
		var _g2 = line.x2 + 1;
		while(_g1 < _g2) {
			var x = _g1++;
			var d = image.data[image.width * y + x];
			var dr = d >> 24 & 255;
			var dg = d >> 16 & 255;
			var db = d >> 8 & 255;
			var da = d & 255;
			var r = (UInt.toFloat(dr * a + sr * ma) / UInt.toFloat(m) | 0) >> 8;
			var g = (UInt.toFloat(dg * a + sg * ma) / UInt.toFloat(m) | 0) >> 8;
			var b = (UInt.toFloat(db * a + sb * ma) / UInt.toFloat(m) | 0) >> 8;
			var a1 = (UInt.toFloat(da * a + sa * ma) / UInt.toFloat(m) | 0) >> 8;
			image.data[image.width * y + x] = ((r < 0 ? 0 : r > 255 ? 255 : r) << 24) + ((g < 0 ? 0 : g > 255 ? 255 : g) << 16) + ((b < 0 ? 0 : b > 255 ? 255 : b) << 8) + (a1 < 0 ? 0 : a1 > 255 ? 255 : a1);
		}
	}
};
geometrize_rasterizer_Rasterizer.copyLines = function(destination,source,lines) {
	if(destination == null) {
		throw haxe_Exception.thrown("FAIL: destination != null");
	}
	if(source == null) {
		throw haxe_Exception.thrown("FAIL: source != null");
	}
	if(lines == null) {
		throw haxe_Exception.thrown("FAIL: lines != null");
	}
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		var y = line.y;
		var _g1 = line.x1;
		var _g2 = line.x2 + 1;
		while(_g1 < _g2) {
			var x = _g1++;
			destination.data[destination.width * y + x] = source.data[source.width * y + x];
		}
	}
};
geometrize_rasterizer_Rasterizer.bresenham = function(x1,y1,x2,y2) {
	var dx = x2 - x1;
	var ix = (dx > 0 ? 1 : 0) - (dx < 0 ? 1 : 0);
	dx = (dx < 0 ? -dx : dx) << 1;
	var dy = y2 - y1;
	var iy = (dy > 0 ? 1 : 0) - (dy < 0 ? 1 : 0);
	dy = (dy < 0 ? -dy : dy) << 1;
	var points = [];
	points.push({ x : x1, y : y1});
	if(dx >= dy) {
		var error = dy - (dx >> 1);
		while(x1 != x2) {
			if(error >= 0 && (error != 0 || ix > 0)) {
				error -= dx;
				y1 += iy;
			}
			error += dy;
			x1 += ix;
			points.push({ x : x1, y : y1});
		}
	} else {
		var error = dx - (dy >> 1);
		while(y1 != y2) {
			if(error >= 0 && (error != 0 || iy > 0)) {
				error -= dy;
				x1 += ix;
			}
			error += dx;
			y1 += iy;
			points.push({ x : x1, y : y1});
		}
	}
	return points;
};
geometrize_rasterizer_Rasterizer.scanlinesForPolygon = function(points) {
	var lines = [];
	var edges = [];
	var _g = 0;
	var _g1 = points.length;
	while(_g < _g1) {
		var i = _g++;
		var p1 = points[i];
		var p2 = i == points.length - 1 ? points[0] : points[i + 1];
		var p1p2 = geometrize_rasterizer_Rasterizer.bresenham(p1.x,p1.y,p2.x,p2.y);
		edges = edges.concat(p1p2);
	}
	var yToXs = new haxe_ds_IntMap();
	var _g = 0;
	while(_g < edges.length) {
		var point = edges[_g];
		++_g;
		var s = yToXs.h[point.y];
		if(s != null) {
			geometrize_ArraySet.add(s,point.x);
		} else {
			s = geometrize_ArraySet.create();
			geometrize_ArraySet.add(s,point.x);
			yToXs.h[point.y] = s;
		}
	}
	var key = yToXs.keys();
	while(key.hasNext()) {
		var key1 = key.next();
		var a = geometrize_ArraySet.toArray(yToXs.h[key1]);
		var minMaxElements;
		if(a == null || a.length == 0) {
			minMaxElements = { x : 0, y : 0};
		} else {
			var min = a[0];
			var max = a[0];
			var _g = 0;
			while(_g < a.length) {
				var value = a[_g];
				++_g;
				if(min > value) {
					min = value;
				}
				if(max < value) {
					max = value;
				}
			}
			minMaxElements = { x : min, y : max};
		}
		lines.push(new geometrize_rasterizer_Scanline(key1,minMaxElements.x,minMaxElements.y));
	}
	return lines;
};
var geometrize_rasterizer_Scanline = function(y,x1,x2) {
	this.y = y;
	this.x1 = x1;
	this.x2 = x2;
};
geometrize_rasterizer_Scanline.__name__ = true;
geometrize_rasterizer_Scanline.trim = function(scanlines,w,h) {
	if(scanlines == null) {
		throw haxe_Exception.thrown("FAIL: scanlines != null");
	}
	var w1 = w;
	var h1 = h;
	var f = function(line) {
		if(line.y < 0 || line.y >= h1 || line.x1 >= w1 || line.x2 < 0) {
			return false;
		} else {
			var value = line.x1;
			var max = w1 - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			line.x1 = value < 0 ? 0 : value > max ? max : value;
			var value = line.x2;
			var max = w1 - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			line.x2 = value < 0 ? 0 : value > max ? max : value;
			return line.x1 <= line.x2;
		}
	};
	var _g = [];
	var _g1 = 0;
	var _g2 = scanlines;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(f(v)) {
			_g.push(v);
		}
	}
	return _g;
};
var geometrize_runner_ImageRunner = $hx_exports["geometrize"]["runner"]["ImageRunner"] = function(inputImage,backgroundColor) {
	this.model = null;
	this.model = new geometrize_Model(inputImage,backgroundColor);
};
geometrize_runner_ImageRunner.__name__ = true;
geometrize_runner_ImageRunner.prototype = {
	step: function(options) {
		var finalOptions_shapeTypes = options.shapeTypes != null && options.shapeTypes.length != 0 ? options.shapeTypes : geometrize_runner_Default.options.shapeTypes;
		var finalOptions_alpha = options.alpha != null ? options.alpha : geometrize_runner_Default.options.alpha;
		var finalOptions_candidateShapesPerStep = options.candidateShapesPerStep != null ? options.candidateShapesPerStep : geometrize_runner_Default.options.candidateShapesPerStep;
		var finalOptions_shapeMutationsPerStep = options.shapeMutationsPerStep != null ? options.shapeMutationsPerStep : geometrize_runner_Default.options.shapeMutationsPerStep;
		return this.model.step(finalOptions_shapeTypes,finalOptions_alpha,finalOptions_candidateShapesPerStep,finalOptions_shapeMutationsPerStep);
	}
	,getImageData: function() {
		if(this.model == null) {
			throw haxe_Exception.thrown("FAIL: model != null");
		}
		return this.model.current;
	}
};
var geometrize_runner_Default = function() { };
geometrize_runner_Default.__name__ = true;
var geometrize_shape_Ellipse = function(xBound,yBound) {
	this.x = Std.random(xBound);
	this.y = Std.random(yBound);
	this.rx = Std.random(32) + 1;
	this.ry = Std.random(32) + 1;
	this.xBound = xBound;
	this.yBound = yBound;
};
geometrize_shape_Ellipse.__name__ = true;
geometrize_shape_Ellipse.prototype = {
	rasterize: function() {
		var lines = [];
		var aspect = this.rx / this.ry;
		var w = this.xBound;
		var h = this.yBound;
		var _g = 0;
		var _g1 = this.ry;
		while(_g < _g1) {
			var dy = _g++;
			var y1 = this.y - dy;
			var y2 = this.y + dy;
			if((y1 < 0 || y1 >= h) && (y2 < 0 || y2 >= h)) {
				continue;
			}
			var s = Math.sqrt(this.ry * this.ry - dy * dy) * aspect | 0;
			var x1 = this.x - s;
			var x2 = this.x + s;
			if(x1 < 0) {
				x1 = 0;
			}
			if(x2 >= w) {
				x2 = w - 1;
			}
			if(y1 >= 0 && y1 < h) {
				lines.push(new geometrize_rasterizer_Scanline(y1,x1,x2));
			}
			if(y2 >= 0 && y2 < h && dy > 0) {
				lines.push(new geometrize_rasterizer_Scanline(y2,x1,x2));
			}
		}
		return lines;
	}
	,mutate: function() {
		var r = Std.random(3);
		switch(r) {
		case 0:
			var value = this.x + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x = value < 0 ? 0 : value > max ? max : value;
			var value = this.y + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.rx + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.rx = value < 1 ? 1 : value > max ? max : value;
			break;
		case 2:
			var value = this.ry + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.ry = value < 1 ? 1 : value > max ? max : value;
			break;
		}
	}
	,clone: function() {
		var ellipse = new geometrize_shape_Ellipse(this.xBound,this.yBound);
		ellipse.x = this.x;
		ellipse.y = this.y;
		ellipse.rx = this.rx;
		ellipse.ry = this.ry;
		return ellipse;
	}
	,getType: function() {
		return 3;
	}
	,getRawShapeData: function() {
		return [this.x,this.y,this.rx,this.ry];
	}
	,getSvgShapeData: function() {
		return "<ellipse cx=\"" + this.x + "\" cy=\"" + this.y + "\" rx=\"" + this.rx + "\" ry=\"" + this.ry + "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + " />";
	}
};
var geometrize_shape_Circle = function(xBound,yBound) {
	geometrize_shape_Ellipse.call(this,xBound,yBound);
	this.rx = Std.random(32) + 1;
	this.ry = this.rx;
};
geometrize_shape_Circle.__name__ = true;
geometrize_shape_Circle.__super__ = geometrize_shape_Ellipse;
geometrize_shape_Circle.prototype = $extend(geometrize_shape_Ellipse.prototype,{
	mutate: function() {
		var r = Std.random(2);
		switch(r) {
		case 0:
			var value = this.x + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x = value < 0 ? 0 : value > max ? max : value;
			var value = this.y + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.rx + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			var r = value < 1 ? 1 : value > max ? max : value;
			this.rx = r;
			this.ry = r;
			break;
		}
	}
	,clone: function() {
		var circle = new geometrize_shape_Circle(this.xBound,this.yBound);
		circle.x = this.x;
		circle.y = this.y;
		circle.rx = this.rx;
		circle.ry = this.ry;
		return circle;
	}
	,getType: function() {
		return 5;
	}
	,getRawShapeData: function() {
		return [this.x,this.y,this.rx];
	}
	,getSvgShapeData: function() {
		return "<circle cx=\"" + this.x + "\" cy=\"" + this.y + "\" r=\"" + this.rx + "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + " />";
	}
});
var geometrize_shape_Line = function(xBound,yBound) {
	this.x1 = Std.random(xBound);
	this.y1 = Std.random(yBound);
	var value = this.x1 + Std.random(32) + 1;
	if(0 > xBound) {
		throw haxe_Exception.thrown("FAIL: min <= max");
	}
	this.x2 = value < 0 ? 0 : value > xBound ? xBound : value;
	var value = this.y1 + Std.random(32) + 1;
	if(0 > yBound) {
		throw haxe_Exception.thrown("FAIL: min <= max");
	}
	this.y2 = value < 0 ? 0 : value > yBound ? yBound : value;
	this.xBound = xBound;
	this.yBound = yBound;
};
geometrize_shape_Line.__name__ = true;
geometrize_shape_Line.prototype = {
	rasterize: function() {
		var lines = [];
		var points = geometrize_rasterizer_Rasterizer.bresenham(this.x1,this.y1,this.x2,this.y2);
		var _g = 0;
		while(_g < points.length) {
			var point = points[_g];
			++_g;
			lines.push(new geometrize_rasterizer_Scanline(point.y,point.x,point.x));
		}
		return geometrize_rasterizer_Scanline.trim(lines,this.xBound,this.yBound);
	}
	,mutate: function() {
		var r = Std.random(4);
		switch(r) {
		case 0:
			var value = this.x1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x1 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y1 = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.x2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x2 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y2 = value < 0 ? 0 : value > max ? max : value;
			break;
		}
	}
	,clone: function() {
		var line = new geometrize_shape_Line(this.xBound,this.yBound);
		line.x1 = this.x1;
		line.y1 = this.y1;
		line.x2 = this.x2;
		line.y2 = this.y2;
		return line;
	}
	,getType: function() {
		return 6;
	}
	,getRawShapeData: function() {
		return [this.x1,this.y1,this.x2,this.y2];
	}
	,getSvgShapeData: function() {
		return "<line x1=\"" + this.x1 + "\" y1=\"" + this.y1 + "\" x2=\"" + this.x2 + "\" y2=\"" + this.y2 + "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + " />";
	}
};
var geometrize_shape_QuadraticBezier = function(xBound,yBound) {
	var upper = xBound - 1;
	if(0 > upper) {
		throw haxe_Exception.thrown("FAIL: lower <= upper");
	}
	this.x1 = Math.floor((upper + 1) * Math.random());
	var upper = yBound - 1;
	if(0 > upper) {
		throw haxe_Exception.thrown("FAIL: lower <= upper");
	}
	this.y1 = Math.floor((upper + 1) * Math.random());
	var upper = xBound - 1;
	if(0 > upper) {
		throw haxe_Exception.thrown("FAIL: lower <= upper");
	}
	this.cx = Math.floor((upper + 1) * Math.random());
	var upper = yBound - 1;
	if(0 > upper) {
		throw haxe_Exception.thrown("FAIL: lower <= upper");
	}
	this.cy = Math.floor((upper + 1) * Math.random());
	var upper = xBound - 1;
	if(0 > upper) {
		throw haxe_Exception.thrown("FAIL: lower <= upper");
	}
	this.x2 = Math.floor((upper + 1) * Math.random());
	var upper = yBound - 1;
	if(0 > upper) {
		throw haxe_Exception.thrown("FAIL: lower <= upper");
	}
	this.y2 = Math.floor((upper + 1) * Math.random());
	this.xBound = xBound;
	this.yBound = yBound;
};
geometrize_shape_QuadraticBezier.__name__ = true;
geometrize_shape_QuadraticBezier.prototype = {
	rasterize: function() {
		var lines = [];
		var points = [];
		var pointCount = 20;
		var _g = 0;
		var _g1 = pointCount - 1;
		while(_g < _g1) {
			var i = _g++;
			var t = i / pointCount;
			var tp = 1 - t;
			var x = tp * (tp * this.x1 + t * this.cx) + t * (tp * this.cx + t * this.x2) | 0;
			var y = tp * (tp * this.y1 + t * this.cy) + t * (tp * this.cy + t * this.y2) | 0;
			points.push({ x : x, y : y});
		}
		var _g = 0;
		var _g1 = points.length - 1;
		while(_g < _g1) {
			var i = _g++;
			var p0 = points[i];
			var p1 = points[i + 1];
			var pts = geometrize_rasterizer_Rasterizer.bresenham(p0.x,p0.y,p1.x,p1.y);
			var _g2 = 0;
			while(_g2 < pts.length) {
				var point = pts[_g2];
				++_g2;
				if(lines.length > 0) {
					var lastLine = lines[lines.length - 1];
					if(lastLine.y == point.y && lastLine.x1 == point.x && lastLine.x2 == point.x) {
						continue;
					}
				}
				lines.push(new geometrize_rasterizer_Scanline(point.y,point.x,point.x));
			}
		}
		return geometrize_rasterizer_Scanline.trim(lines,this.xBound,this.yBound);
	}
	,mutate: function() {
		var r = Math.floor(3 * Math.random());
		switch(r) {
		case 0:
			var value = this.cx + (-8 + Math.floor(17 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.cx = value < 0 ? 0 : value > max ? max : value;
			var value = this.cy + (-8 + Math.floor(17 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.cy = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.x1 + (-8 + Math.floor(17 * Math.random()));
			var max = this.xBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x1 = value < 1 ? 1 : value > max ? max : value;
			var value = this.y1 + (-8 + Math.floor(17 * Math.random()));
			var max = this.yBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y1 = value < 1 ? 1 : value > max ? max : value;
			break;
		case 2:
			var value = this.x2 + (-8 + Math.floor(17 * Math.random()));
			var max = this.xBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x2 = value < 1 ? 1 : value > max ? max : value;
			var value = this.y2 + (-8 + Math.floor(17 * Math.random()));
			var max = this.yBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y2 = value < 1 ? 1 : value > max ? max : value;
			break;
		}
	}
	,clone: function() {
		var bezier = new geometrize_shape_QuadraticBezier(this.xBound,this.yBound);
		bezier.cx = this.cx;
		bezier.cy = this.cy;
		bezier.x1 = this.x1;
		bezier.y1 = this.y1;
		bezier.x2 = this.x2;
		bezier.y2 = this.y2;
		return bezier;
	}
	,getType: function() {
		return 7;
	}
	,getRawShapeData: function() {
		return [this.x1,this.y1,this.cx,this.cy,this.x2,this.y2];
	}
	,getSvgShapeData: function() {
		return "<path d=\"M" + this.x1 + " " + this.y1 + " Q " + this.cx + " " + this.cy + " " + this.x2 + " " + this.y2 + "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + " />";
	}
};
var geometrize_shape_Rectangle = function(xBound,yBound) {
	this.x1 = Std.random(xBound);
	this.y1 = Std.random(yBound);
	var value = this.x1 + Std.random(32) + 1;
	var max = xBound - 1;
	if(0 > max) {
		throw haxe_Exception.thrown("FAIL: min <= max");
	}
	this.x2 = value < 0 ? 0 : value > max ? max : value;
	var value = this.y1 + Std.random(32) + 1;
	var max = yBound - 1;
	if(0 > max) {
		throw haxe_Exception.thrown("FAIL: min <= max");
	}
	this.y2 = value < 0 ? 0 : value > max ? max : value;
	this.xBound = xBound;
	this.yBound = yBound;
};
geometrize_shape_Rectangle.__name__ = true;
geometrize_shape_Rectangle.prototype = {
	rasterize: function() {
		var lines = [];
		var first = this.y1;
		var second = this.y2;
		var yMin = first < second ? first : second;
		var first = this.y1;
		var second = this.y2;
		var yMax = first > second ? first : second;
		if(yMin == yMax) {
			var first = this.x1;
			var second = this.x2;
			var first1 = this.x1;
			var second1 = this.x2;
			lines.push(new geometrize_rasterizer_Scanline(yMin,first < second ? first : second,first1 > second1 ? first1 : second1));
		} else {
			var _g = yMin;
			var _g1 = yMax;
			while(_g < _g1) {
				var y = _g++;
				var first = this.x1;
				var second = this.x2;
				var first1 = this.x1;
				var second1 = this.x2;
				lines.push(new geometrize_rasterizer_Scanline(y,first < second ? first : second,first1 > second1 ? first1 : second1));
			}
		}
		return lines;
	}
	,mutate: function() {
		var r = Std.random(2);
		switch(r) {
		case 0:
			var value = this.x1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x1 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y1 = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.x2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x2 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y2 = value < 0 ? 0 : value > max ? max : value;
			break;
		}
	}
	,clone: function() {
		var rectangle = new geometrize_shape_Rectangle(this.xBound,this.yBound);
		rectangle.x1 = this.x1;
		rectangle.y1 = this.y1;
		rectangle.x2 = this.x2;
		rectangle.y2 = this.y2;
		return rectangle;
	}
	,getType: function() {
		return 0;
	}
	,getRawShapeData: function() {
		var first = this.x1;
		var second = this.x2;
		var first1 = this.y1;
		var second1 = this.y2;
		var first2 = this.x1;
		var second2 = this.x2;
		var first3 = this.y1;
		var second3 = this.y2;
		return [first < second ? first : second,first1 < second1 ? first1 : second1,first2 > second2 ? first2 : second2,first3 > second3 ? first3 : second3];
	}
	,getSvgShapeData: function() {
		var first = this.x1;
		var second = this.x2;
		var first1 = this.y1;
		var second1 = this.y2;
		var first2 = this.x1;
		var second2 = this.x2;
		var first3 = this.x1;
		var second3 = this.x2;
		var first4 = this.y1;
		var second4 = this.y2;
		var first5 = this.y1;
		var second5 = this.y2;
		return "<rect x=\"" + (first < second ? first : second) + "\" y=\"" + (first1 < second1 ? first1 : second1) + "\" width=\"" + ((first2 > second2 ? first2 : second2) - (first3 < second3 ? first3 : second3)) + "\" height=\"" + ((first4 > second4 ? first4 : second4) - (first5 < second5 ? first5 : second5)) + "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + " />";
	}
};
var geometrize_shape_RotatedEllipse = function(xBound,yBound) {
	this.x = Std.random(xBound);
	this.y = Std.random(yBound);
	this.rx = Std.random(32) + 1;
	this.ry = Std.random(32) + 1;
	this.angle = Std.random(360);
	this.xBound = xBound;
	this.yBound = yBound;
};
geometrize_shape_RotatedEllipse.__name__ = true;
geometrize_shape_RotatedEllipse.prototype = {
	rasterize: function() {
		var pointCount = 20;
		var points = [];
		var rads = this.angle * (Math.PI / 180.0);
		var c = Math.cos(rads);
		var s = Math.sin(rads);
		var _g = 0;
		var _g1 = pointCount;
		while(_g < _g1) {
			var i = _g++;
			var rot = 360.0 / pointCount * i * (Math.PI / 180.0);
			var crx = this.rx * Math.cos(rot);
			var cry = this.ry * Math.sin(rot);
			var tx = crx * c - cry * s + this.x | 0;
			var ty = crx * s + cry * c + this.y | 0;
			points.push({ x : tx, y : ty});
		}
		return geometrize_rasterizer_Scanline.trim(geometrize_rasterizer_Rasterizer.scanlinesForPolygon(points),this.xBound,this.yBound);
	}
	,mutate: function() {
		var r = Std.random(4);
		switch(r) {
		case 0:
			var value = this.x + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x = value < 0 ? 0 : value > max ? max : value;
			var value = this.y + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.rx + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.rx = value < 1 ? 1 : value > max ? max : value;
			break;
		case 2:
			var value = this.ry + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(1 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.ry = value < 1 ? 1 : value > max ? max : value;
			break;
		case 3:
			var value = this.angle + (-4 + Math.floor(9 * Math.random()));
			this.angle = value < 0 ? 0 : value > 360 ? 360 : value;
			break;
		}
	}
	,clone: function() {
		var ellipse = new geometrize_shape_RotatedEllipse(this.xBound,this.yBound);
		ellipse.x = this.x;
		ellipse.y = this.y;
		ellipse.rx = this.rx;
		ellipse.ry = this.ry;
		ellipse.angle = this.angle;
		return ellipse;
	}
	,getType: function() {
		return 4;
	}
	,getRawShapeData: function() {
		return [this.x,this.y,this.rx,this.ry,this.angle];
	}
	,getSvgShapeData: function() {
		var s = "<g transform=\"translate(" + this.x + " " + this.y + ") rotate(" + this.angle + ") scale(" + this.rx + " " + this.ry + ")\">";
		s += "<ellipse cx=\"" + 0 + "\" cy=\"" + 0 + "\" rx=\"" + 1 + "\" ry=\"" + 1 + "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + " />";
		s += "</g>";
		return s;
	}
};
var geometrize_shape_RotatedRectangle = function(xBound,yBound) {
	this.x1 = Std.random(xBound);
	this.y1 = Std.random(yBound);
	var value = this.x1 + Std.random(32) + 1;
	if(0 > xBound) {
		throw haxe_Exception.thrown("FAIL: min <= max");
	}
	this.x2 = value < 0 ? 0 : value > xBound ? xBound : value;
	var value = this.y1 + Std.random(32) + 1;
	if(0 > yBound) {
		throw haxe_Exception.thrown("FAIL: min <= max");
	}
	this.y2 = value < 0 ? 0 : value > yBound ? yBound : value;
	this.angle = Math.floor(361 * Math.random());
	this.xBound = xBound;
	this.yBound = yBound;
};
geometrize_shape_RotatedRectangle.__name__ = true;
geometrize_shape_RotatedRectangle.prototype = {
	rasterize: function() {
		var first = this.x1;
		var second = this.x2;
		var xm1 = first < second ? first : second;
		var first = this.x1;
		var second = this.x2;
		var xm2 = first > second ? first : second;
		var first = this.y1;
		var second = this.y2;
		var ym1 = first < second ? first : second;
		var first = this.y1;
		var second = this.y2;
		var ym2 = first > second ? first : second;
		var cx = (xm1 + xm2) / 2 | 0;
		var cy = (ym1 + ym2) / 2 | 0;
		var ox1 = xm1 - cx;
		var ox2 = xm2 - cx;
		var oy1 = ym1 - cy;
		var oy2 = ym2 - cy;
		var rads = this.angle * Math.PI / 180.0;
		var c = Math.cos(rads);
		var s = Math.sin(rads);
		var ulx = ox1 * c - oy1 * s + cx | 0;
		var uly = ox1 * s + oy1 * c + cy | 0;
		var blx = ox1 * c - oy2 * s + cx | 0;
		var bly = ox1 * s + oy2 * c + cy | 0;
		var urx = ox2 * c - oy1 * s + cx | 0;
		var ury = ox2 * s + oy1 * c + cy | 0;
		var brx = ox2 * c - oy2 * s + cx | 0;
		var bry = ox2 * s + oy2 * c + cy | 0;
		return geometrize_rasterizer_Scanline.trim(geometrize_rasterizer_Rasterizer.scanlinesForPolygon([{ x : ulx, y : uly},{ x : urx, y : ury},{ x : brx, y : bry},{ x : blx, y : bly}]),this.xBound,this.yBound);
	}
	,mutate: function() {
		var r = Std.random(3);
		switch(r) {
		case 0:
			var value = this.x1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x1 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y1 = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.x2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x2 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y2 = value < 0 ? 0 : value > max ? max : value;
			break;
		case 2:
			var value = this.angle + (-4 + Math.floor(9 * Math.random()));
			this.angle = value < 0 ? 0 : value > 360 ? 360 : value;
			break;
		}
	}
	,clone: function() {
		var rectangle = new geometrize_shape_RotatedRectangle(this.xBound,this.yBound);
		rectangle.x1 = this.x1;
		rectangle.y1 = this.y1;
		rectangle.x2 = this.x2;
		rectangle.y2 = this.y2;
		rectangle.angle = this.angle;
		return rectangle;
	}
	,getType: function() {
		return 1;
	}
	,getRawShapeData: function() {
		var first = this.x1;
		var second = this.x2;
		var first1 = this.y1;
		var second1 = this.y2;
		var first2 = this.x1;
		var second2 = this.x2;
		var first3 = this.y1;
		var second3 = this.y2;
		return [first < second ? first : second,first1 < second1 ? first1 : second1,first2 > second2 ? first2 : second2,first3 > second3 ? first3 : second3,this.angle];
	}
	,getSvgShapeData: function() {
		var first = this.x1;
		var second = this.x2;
		var xm1 = first < second ? first : second;
		var first = this.x1;
		var second = this.x2;
		var xm2 = first > second ? first : second;
		var first = this.y1;
		var second = this.y2;
		var ym1 = first < second ? first : second;
		var first = this.y1;
		var second = this.y2;
		var ym2 = first > second ? first : second;
		var cx = (xm1 + xm2) / 2 | 0;
		var cy = (ym1 + ym2) / 2 | 0;
		var ox1 = xm1 - cx;
		var ox2 = xm2 - cx;
		var oy1 = ym1 - cy;
		var oy2 = ym2 - cy;
		var rads = this.angle * Math.PI / 180.0;
		var c = Math.cos(rads);
		var s = Math.sin(rads);
		var ulx = ox1 * c - oy1 * s + cx | 0;
		var uly = ox1 * s + oy1 * c + cy | 0;
		var blx = ox1 * c - oy2 * s + cx | 0;
		var bly = ox1 * s + oy2 * c + cy | 0;
		var urx = ox2 * c - oy1 * s + cx | 0;
		var ury = ox2 * s + oy1 * c + cy | 0;
		var brx = ox2 * c - oy2 * s + cx | 0;
		var bry = ox2 * s + oy2 * c + cy | 0;
		var points = [{ x : ulx, y : uly},{ x : urx, y : ury},{ x : brx, y : bry},{ x : blx, y : bly}];
		var s = "<polygon points=\"";
		var _g = 0;
		var _g1 = points.length;
		while(_g < _g1) {
			var i = _g++;
			s += points[i].x + " " + points[i].y;
			if(i != points.length - 1) {
				s += " ";
			}
		}
		s += "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + "/>";
		return s;
	}
};
var geometrize_shape_ShapeFactory = function() { };
geometrize_shape_ShapeFactory.__name__ = true;
geometrize_shape_ShapeFactory.create = function(type,xBound,yBound) {
	switch(type) {
	case 0:
		return new geometrize_shape_Rectangle(xBound,yBound);
	case 1:
		return new geometrize_shape_RotatedRectangle(xBound,yBound);
	case 2:
		return new geometrize_shape_Triangle(xBound,yBound);
	case 3:
		return new geometrize_shape_Ellipse(xBound,yBound);
	case 4:
		return new geometrize_shape_RotatedEllipse(xBound,yBound);
	case 5:
		return new geometrize_shape_Circle(xBound,yBound);
	case 6:
		return new geometrize_shape_Line(xBound,yBound);
	case 7:
		return new geometrize_shape_QuadraticBezier(xBound,yBound);
	}
};
geometrize_shape_ShapeFactory.randomShapeOf = function(types,xBound,yBound) {
	if(!(types != null && types.length > 0)) {
		throw haxe_Exception.thrown("FAIL: a != null && a.length > 0");
	}
	var upper = types.length - 1;
	if(0 > upper) {
		throw haxe_Exception.thrown("FAIL: lower <= upper");
	}
	return geometrize_shape_ShapeFactory.create(types[Math.floor((upper + 1) * Math.random())],xBound,yBound);
};
var geometrize_shape_ShapeTypes = $hx_exports["geometrize"]["shape"]["ShapeTypes"] = function() { };
geometrize_shape_ShapeTypes.__name__ = true;
var geometrize_shape_Triangle = function(xBound,yBound) {
	this.x1 = Std.random(xBound);
	this.y1 = Std.random(yBound);
	this.x2 = this.x1 + (-16 + Math.floor(33 * Math.random()));
	this.y2 = this.y1 + (-16 + Math.floor(33 * Math.random()));
	this.x3 = this.x1 + (-16 + Math.floor(33 * Math.random()));
	this.y3 = this.y1 + (-16 + Math.floor(33 * Math.random()));
	this.xBound = xBound;
	this.yBound = yBound;
};
geometrize_shape_Triangle.__name__ = true;
geometrize_shape_Triangle.prototype = {
	rasterize: function() {
		return geometrize_rasterizer_Scanline.trim(geometrize_rasterizer_Rasterizer.scanlinesForPolygon([{ x : this.x1, y : this.y1},{ x : this.x2, y : this.y2},{ x : this.x3, y : this.y3}]),this.xBound,this.yBound);
	}
	,mutate: function() {
		var r = Std.random(3);
		switch(r) {
		case 0:
			var value = this.x1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x1 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y1 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y1 = value < 0 ? 0 : value > max ? max : value;
			break;
		case 1:
			var value = this.x2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x2 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y2 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y2 = value < 0 ? 0 : value > max ? max : value;
			break;
		case 2:
			var value = this.x3 + (-16 + Math.floor(33 * Math.random()));
			var max = this.xBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.x3 = value < 0 ? 0 : value > max ? max : value;
			var value = this.y3 + (-16 + Math.floor(33 * Math.random()));
			var max = this.yBound - 1;
			if(0 > max) {
				throw haxe_Exception.thrown("FAIL: min <= max");
			}
			this.y3 = value < 0 ? 0 : value > max ? max : value;
			break;
		}
	}
	,clone: function() {
		var triangle = new geometrize_shape_Triangle(this.xBound,this.yBound);
		triangle.x1 = this.x1;
		triangle.y1 = this.y1;
		triangle.x2 = this.x2;
		triangle.y2 = this.y2;
		triangle.x3 = this.x3;
		triangle.y3 = this.y3;
		return triangle;
	}
	,getType: function() {
		return 2;
	}
	,getRawShapeData: function() {
		return [this.x1,this.y1,this.x2,this.y2,this.x3,this.y3];
	}
	,getSvgShapeData: function() {
		return "<polygon points=\"" + this.x1 + "," + this.y1 + " " + this.x2 + "," + this.y2 + " " + this.x3 + "," + this.y3 + "\" " + geometrize_exporter_SvgExporter.SVG_STYLE_HOOK + "/>";
	}
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	get_native: function() {
		return this.__nativeException;
	}
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
});
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var $_;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
Main.runPauseButton = window.document.getElementById("runpausebutton");
Main.stepButton = window.document.getElementById("stepbutton");
Main.openImageFileInput = window.document.getElementById("openimageinput");
Main.randomImageButton = window.document.getElementById("randomimagebutton");
Main.resetButton = window.document.getElementById("resetbutton");
Main.saveImageButton = window.document.getElementById("saveimagebutton");
Main.saveSvgButton = window.document.getElementById("savesvgbutton");
Main.saveJsonButton = window.document.getElementById("savejsonbutton");
Main.rectanglesCheckbox = window.document.getElementById("rectangles");
Main.rotatedRectanglesCheckbox = window.document.getElementById("rotatedrectangles");
Main.trianglesCheckbox = window.document.getElementById("triangles");
Main.ellipsesCheckbox = window.document.getElementById("ellipses");
Main.rotatedEllipsesCheckbox = window.document.getElementById("rotatedellipses");
Main.circlesCheckbox = window.document.getElementById("circles");
Main.linesCheckbox = window.document.getElementById("lines");
Main.quadraticBeziersCheckbox = window.document.getElementById("quadraticbeziers");
Main.shapeOpacitySlider = window.document.getElementById("shapeopacity");
Main.initialBackgroundOpacitySlider = window.document.getElementById("initialbackgroundopacity");
Main.randomShapesPerStepSlider = window.document.getElementById("randomshapesperstep");
Main.shapeMutationsPerStepSlider = window.document.getElementById("shapemutationsperstep");
Main.shapesAddedText = window.document.getElementById("shapesaddedtext");
Main.maxShapesCapTextEdit = window.document.getElementById("maxshapescaptextedit");
Main.currentSvgContainer = window.document.getElementById("currentsvgcontainer");
Main.sampleImagesContainer = window.document.getElementById("sampleimages");
Main.defaultImageElement = window.document.getElementById("defaultimage");
Main.imagesToGeometrize = ["assets/images/demo_images/beach_sunset.jpg","assets/images/demo_images/boat.jpg","assets/images/demo_images/borrowdale_valley.jpg","assets/images/demo_images/building.jpg","assets/images/demo_images/borrowdale_valley.jpg","assets/images/demo_images/building.jpg","assets/images/demo_images/candle_yet_another.jpg","assets/images/demo_images/cat_staring.jpg","assets/images/demo_images/chomsky.jpg","assets/images/demo_images/grapefruit.jpg","assets/images/demo_images/london.jpg","assets/images/demo_images/lynx_staring.jpg","assets/images/demo_images/mindblown.jpg","assets/images/demo_images/mountain.jpg","assets/images/demo_images/papillon_dog.jpg","assets/images/demo_images/pier.jpg","assets/images/demo_images/pylon_and_sun.jpg","assets/images/demo_images/seagull.jpg","assets/images/demo_images/sun_and_tree.jpg","assets/images/demo_images/sun_over_hills.jpg","assets/images/demo_images/the_great_pyramid_at_giza.jpg","assets/images/demo_images/the_lady_of_shalott.jpg","assets/images/demo_images/tree_and_clouds.jpg","assets/images/demo_images/windswept.jpg","assets/images/demo_images/wolf.jpg","assets/images/demo_images/woodland_cemetery.jpg"];
geometrize_exporter_SvgExporter.SVG_STYLE_HOOK = "::svg_style_hook::";
geometrize_runner_Default.options = { shapeTypes : [2], candidateShapesPerStep : 50, shapeMutationsPerStep : 100, alpha : 128};
geometrize_shape_ShapeTypes.RECTANGLE = 0;
geometrize_shape_ShapeTypes.ROTATED_RECTANGLE = 1;
geometrize_shape_ShapeTypes.TRIANGLE = 2;
geometrize_shape_ShapeTypes.ELLIPSE = 3;
geometrize_shape_ShapeTypes.ROTATED_ELLIPSE = 4;
geometrize_shape_ShapeTypes.CIRCLE = 5;
geometrize_shape_ShapeTypes.LINE = 6;
geometrize_shape_ShapeTypes.QUADRATIC_BEZIER = 7;
Main.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
