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
var GeometrizeWorker = function() { };
GeometrizeWorker.prototype = {
	messageHandler: function(event) {
		if(event == null || event.data == null) {
			return;
		}
		var message = event.data;
		switch(message.id) {
		case "should_set_target_image":
			var target = message.data;
			this.runner = new geometrize_runner_ImageRunner(target,geometrize_Util.getAverageImageColor(target));
			this.postMessage({ id : "did_set_target_image"});
			break;
		case "should_step":
			var options = message.data;
			var results = this.runner.step(options);
			var svgData = geometrize_exporter_SvgExporter.exportShapes(results);
			var jsonData = geometrize_exporter_ShapeJsonExporter.exportShapes(results);
			this.postMessage({ id : "did_step", svgData : svgData, jsonData : jsonData});
			break;
		}
	}
	,postMessage: function(message) {
	}
};
var Std = function() { };
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var StringTools = function() { };
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
var geometrize_shape_Ellipse = function(xBound,yBound) {
	this.x = Std.random(xBound);
	this.y = Std.random(yBound);
	this.rx = Std.random(32) + 1;
	this.ry = Std.random(32) + 1;
	this.xBound = xBound;
	this.yBound = yBound;
};
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
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
});
var haxe_ds_IntMap = function() {
	this.h = { };
};
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
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
onmessage = GeometrizeWorker.prototype.messageHandler;
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
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, {});
