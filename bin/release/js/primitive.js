(function (console, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var _$ArraySet_ArraySet_$Impl_$ = {};
_$ArraySet_ArraySet_$Impl_$.__name__ = true;
_$ArraySet_ArraySet_$Impl_$.create = function(array) {
	if(array == null) return [];
	return _$ArraySet_ArraySet_$Impl_$.toSet(array);
};
_$ArraySet_ArraySet_$Impl_$.intersection = function(this1,set) {
	var result = [];
	var _g = 0;
	while(_g < this1.length) {
		var element = this1[_g];
		++_g;
		if(_$ArraySet_ArraySet_$Impl_$.contains(set,element)) result.push(element);
	}
	return result;
};
_$ArraySet_ArraySet_$Impl_$.union = function(this1,set) {
	return _$ArraySet_ArraySet_$Impl_$.toSet(this1.concat(_$ArraySet_ArraySet_$Impl_$.toArray(set)));
};
_$ArraySet_ArraySet_$Impl_$.unionArray = function(this1,array) {
	return _$ArraySet_ArraySet_$Impl_$.toSet(this1.concat(array));
};
_$ArraySet_ArraySet_$Impl_$.difference = function(this1,set) {
	var result;
	var array = this1.slice();
	result = array;
	var $it0 = HxOverrides.iter(set);
	while( $it0.hasNext() ) {
		var element = $it0.next();
		HxOverrides.remove(result,element);
	}
	var array1 = _$ArraySet_ArraySet_$Impl_$.toArray(result);
	return array1;
};
_$ArraySet_ArraySet_$Impl_$.add = function(this1,element) {
	if(!(element != null)) throw new js__$Boot_HaxeError("FAIL: element != null");
	if(_$ArraySet_ArraySet_$Impl_$.contains(this1,element)) return false;
	this1.push(element);
	return true;
};
_$ArraySet_ArraySet_$Impl_$.contains = function(this1,element) {
	var _g = 0;
	while(_g < this1.length) {
		var i = this1[_g];
		++_g;
		if(i == element) return true;
	}
	return false;
};
_$ArraySet_ArraySet_$Impl_$.copy = function(this1) {
	var array = this1.slice();
	return array;
};
_$ArraySet_ArraySet_$Impl_$.slice = function(this1,position,end) {
	var array = this1.slice(position,end);
	return array;
};
_$ArraySet_ArraySet_$Impl_$.splice = function(this1,position,length) {
	var array = this1.splice(position,length);
	return array;
};
_$ArraySet_ArraySet_$Impl_$.toArray = function(this1) {
	return this1.slice();
};
_$ArraySet_ArraySet_$Impl_$.toSet = function(array) {
	var set = [];
	var _g = 0;
	while(_g < array.length) {
		var v = array[_g];
		++_g;
		_$ArraySet_ArraySet_$Impl_$.add(set,v);
	}
	return set;
};
_$ArraySet_ArraySet_$Impl_$._new = function(array) {
	return array;
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var ID = function() { };
ID.__name__ = true;
var Main = function() {
	window.onload = $bind(this,this.onWindowLoaded);
};
Main.__name__ = true;
Main.main = function() {
	var main = new Main();
};
Main.prototype = {
	onWindowLoaded: function() {
		this.shapeTypes = _$ArraySet_ArraySet_$Impl_$.create([primitive_shape_ShapeType.CIRCLE]);
		this.shapeAlpha = 128;
		this.reducedSearchRepeats = 1;
		this.candidateShapesPerStep = 50;
		this.shapeMutationsPerStep = 100;
		this.runner = new primitive_runner_ImageRunner(this.inputImage);
		null;
	}
	,constructRunnerOptions: function() {
		return new primitive_runner_ImageRunnerOptions(_$ArraySet_ArraySet_$Impl_$.toArray(this.shapeTypes),this.shapeAlpha,this.reducedSearchRepeats,this.candidateShapesPerStep,this.shapeMutationsPerStep);
	}
	,reset: function() {
		this.shapeTypes = _$ArraySet_ArraySet_$Impl_$.create([primitive_shape_ShapeType.CIRCLE]);
		this.shapeAlpha = 128;
		this.reducedSearchRepeats = 1;
		this.candidateShapesPerStep = 50;
		this.shapeMutationsPerStep = 100;
		this.runner = new primitive_runner_ImageRunner(this.inputImage);
	}
	,createSliders: function() {
	}
	,addEventListeners: function() {
	}
	,createTooltips: function(slider) {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		var _g1 = 0;
		var _g = tipHandles.length;
		while(_g1 < _g) {
			var i = _g1++;
			var div = window.document.createElement("div");
			div.className += "tooltip";
			tipHandles[i].appendChild(div);
			this.updateTooltips(slider,i,0);
		}
	}
	,updateTooltips: function(slider,handleIdx,value) {
		var tipHandles = slider.getElementsByClassName("noUi-handle");
		tipHandles[handleIdx].innerHTML = "<span class='tooltip'>" + (value == null?"null":"" + value) + "</span>";
	}
	,__class__: Main
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var Type = function() { };
Type.__name__ = true;
Type.allEnums = function(e) {
	return e.__empty_constructs__;
};
var _$UInt_UInt_$Impl_$ = {};
_$UInt_UInt_$Impl_$.__name__ = true;
_$UInt_UInt_$Impl_$.toFloat = function(this1) {
	var $int = this1;
	if($int < 0) return 4294967296.0 + $int; else return $int + 0.0;
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = true;
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.prototype = {
	__class__: haxe_io_Bytes
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
haxe_io_Error.__empty_constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds];
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = true;
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
js_html_compat_DataView.__name__ = true;
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var primitive_Model = function(target,backgroundColor,outputSize) {
	if(!(target != null)) throw new js__$Boot_HaxeError("FAIL: target != null");
	this.width = target.width;
	this.height = target.height;
	this.backgroundColor = backgroundColor;
	this.target = target;
	this.current = primitive_bitmap_Bitmap.create(target.width,target.height,backgroundColor);
	this.buffer = primitive_bitmap_Bitmap.create(target.width,target.height,backgroundColor);
	this.score = primitive_Primitive.differenceFull(target,this.current);
};
primitive_Model.__name__ = true;
primitive_Model.prototype = {
	step: function(shapeTypes,alpha,repeats,n,age) {
		var state = primitive_Primitive.bestHillClimbState(shapeTypes,alpha,n,age,repeats,this.target,this.current,this.buffer,this.score);
		var results = [];
		results.push(this.addShape(state.shape,state.alpha));
		var _g = 0;
		while(_g < repeats) {
			var i = _g++;
			var before = state.energy(this.score);
			state = primitive_Primitive.hillClimb(state,100,this.score);
			var after = state.energy(this.score);
			if(before == after) break;
			results.push(this.addShape(state.shape,state.alpha));
		}
		return results;
	}
	,addShape: function(shape,alpha) {
		if(!(shape != null)) throw new js__$Boot_HaxeError("FAIL: shape != null");
		var before = this.current.clone();
		var lines = shape.rasterize();
		var color = primitive_Primitive.computeColor(this.target,this.current,lines,alpha);
		primitive_Primitive.drawLines(this.current,color,lines);
		this.score = primitive_Primitive.differencePartial(this.target,before,this.current,this.score,lines);
		var result = { score : this.score, color : color, shape : shape};
		return result;
	}
	,__class__: primitive_Model
};
var primitive_Primitive = function() { };
primitive_Primitive.__name__ = true;
primitive_Primitive.energy = function(shape,alpha,target,current,buffer,score) {
	if(!(shape != null)) throw new js__$Boot_HaxeError("FAIL: shape != null");
	if(!(target != null)) throw new js__$Boot_HaxeError("FAIL: target != null");
	if(!(current != null)) throw new js__$Boot_HaxeError("FAIL: current != null");
	if(!(buffer != null)) throw new js__$Boot_HaxeError("FAIL: buffer != null");
	var lines = shape.rasterize();
	var color = primitive_Primitive.computeColor(target,current,lines,alpha);
	primitive_Primitive.copyLines(buffer,current,lines);
	primitive_Primitive.drawLines(buffer,color,lines);
	return primitive_Primitive.differencePartial(target,current,buffer,score,lines);
};
primitive_Primitive.computeColor = function(target,current,lines,alpha) {
	if(!(target != null)) throw new js__$Boot_HaxeError("FAIL: target != null");
	if(!(current != null)) throw new js__$Boot_HaxeError("FAIL: current != null");
	if(!(lines != null)) throw new js__$Boot_HaxeError("FAIL: lines != null");
	if(!(alpha >= 0)) throw new js__$Boot_HaxeError("FAIL: alpha >= 0");
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
		var _g2 = line.x1;
		var _g1 = line.x2;
		while(_g2 < _g1) {
			var x = _g2++;
			var t = target.data[target.width * y + x];
			var c = current.data[current.width * y + x];
			totalRed += ((t >> 24 & 255) - (c >> 24 & 255)) * a + (c >> 24 & 255) * 257;
			totalGreen += ((t >> 16 & 255) - (c >> 16 & 255)) * a + (c >> 16 & 255) * 257;
			totalBlue += ((t >> 8 & 255) - (c >> 8 & 255)) * a + (c >> 8 & 255) * 257;
			count++;
		}
	}
	if(count == 0) return 0;
	var r = primitive_Util.clamp((totalRed / count | 0) >> 8,0,255);
	var g = primitive_Util.clamp((totalGreen / count | 0) >> 8,0,255);
	var b = primitive_Util.clamp((totalBlue / count | 0) >> 8,0,255);
	return ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = r < 0?0:r > 255?255:r;
		return $r;
	}(this)) << 24) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = g < 0?0:g > 255?255:g;
		return $r;
	}(this)) << 16) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = b < 0?0:b > 255?255:b;
		return $r;
	}(this)) << 8) + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = alpha < 0?0:alpha > 255?255:alpha;
		return $r;
	}(this));
};
primitive_Primitive.drawLines = function(image,c,lines) {
	if(!(image != null)) throw new js__$Boot_HaxeError("FAIL: image != null");
	if(!(lines != null)) throw new js__$Boot_HaxeError("FAIL: lines != null");
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
		var ma = line.alpha;
		var m = 65535;
		var $as = (m - sa * (ma / m)) * 257;
		var a = $as | 0;
		var _g2 = line.x1;
		var _g1 = line.x2;
		while(_g2 < _g1) {
			var x = _g2++;
			var d = image.data[image.width * y + x];
			var dr = d >> 24 & 255;
			var dg = d >> 16 & 255;
			var db = d >> 8 & 255;
			var da = d & 255;
			var r = Std["int"](_$UInt_UInt_$Impl_$.toFloat(dr * a + sr * ma) / _$UInt_UInt_$Impl_$.toFloat(m)) >> 8;
			var g = Std["int"](_$UInt_UInt_$Impl_$.toFloat(dg * a + sg * ma) / _$UInt_UInt_$Impl_$.toFloat(m)) >> 8;
			var b = Std["int"](_$UInt_UInt_$Impl_$.toFloat(db * a + sb * ma) / _$UInt_UInt_$Impl_$.toFloat(m)) >> 8;
			var a1 = Std["int"](_$UInt_UInt_$Impl_$.toFloat(da * a + sa * ma) / _$UInt_UInt_$Impl_$.toFloat(m)) >> 8;
			image.setPixel(x,y,((function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
				$r = r < 0?0:r > 255?255:r;
				return $r;
			}(this)) << 24) + ((function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
				$r = g < 0?0:g > 255?255:g;
				return $r;
			}(this)) << 16) + ((function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
				$r = b < 0?0:b > 255?255:b;
				return $r;
			}(this)) << 8) + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
				$r = a1 < 0?0:a1 > 255?255:a1;
				return $r;
			}(this)));
		}
	}
};
primitive_Primitive.copyLines = function(destination,source,lines) {
	if(!(destination != null)) throw new js__$Boot_HaxeError("FAIL: destination != null");
	if(!(source != null)) throw new js__$Boot_HaxeError("FAIL: source != null");
	if(!(lines != null)) throw new js__$Boot_HaxeError("FAIL: lines != null");
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		var y = line.y;
		var _g2 = line.x1;
		var _g1 = line.x2;
		while(_g2 < _g1) {
			var x = _g2++;
			destination.data[destination.width * y + x] = source.data[source.width * y + x];
		}
	}
};
primitive_Primitive.differenceFull = function(first,second) {
	if(!(first != null)) throw new js__$Boot_HaxeError("FAIL: first != null");
	if(!(second != null)) throw new js__$Boot_HaxeError("FAIL: second != null");
	var actual = first.width;
	var expected = second.width;
	if(actual != expected) throw new js__$Boot_HaxeError("FAIL: values are not equal (expected: " + expected + ", actual: " + actual + ")");
	var actual1 = first.height;
	var expected1 = second.height;
	if(actual1 != expected1) throw new js__$Boot_HaxeError("FAIL: values are not equal (expected: " + expected1 + ", actual: " + actual1 + ")");
	var total = 0;
	var width = first.width;
	var height = first.height;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			var f = first.data[first.width * y + x];
			var s = second.data[second.width * y + x];
			var dr = (f >> 24 & 255) - (s >> 24 & 255);
			var dg = (f >> 16 & 255) - (s >> 16 & 255);
			var db = (f >> 8 & 255) - (s >> 8 & 255);
			total = total + (dr * dr + dg * dg + db * db);
		}
	}
	return Math.sqrt(_$UInt_UInt_$Impl_$.toFloat(total) / (width * height * 3.0)) / 255;
};
primitive_Primitive.differencePartial = function(target,before,after,score,lines) {
	if(!(target != null)) throw new js__$Boot_HaxeError("FAIL: target != null");
	if(!(before != null)) throw new js__$Boot_HaxeError("FAIL: before != null");
	if(!(after != null)) throw new js__$Boot_HaxeError("FAIL: after != null");
	if(!(lines != null)) throw new js__$Boot_HaxeError("FAIL: lines != null");
	var width = target.width;
	var height = target.height;
	var rgbCount = width * height * 3;
	var total = Std["int"](Math.pow(score * 255,2) * rgbCount);
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		var y = line.y;
		var _g2 = line.x1;
		var _g1 = line.x2;
		while(_g2 < _g1) {
			var x = _g2++;
			var t = target.data[target.width * y + x];
			var b = before.data[before.width * y + x];
			var a = after.data[after.width * y + x];
			var dtbr = (t >> 24 & 255) - (b >> 24 & 255);
			var dtbg = (t >> 16 & 255) - (b >> 16 & 255);
			var dtbb = (t >> 8 & 255) - (b >> 8 & 255);
			var dtar = (t >> 24 & 255) - (a >> 24 & 255);
			var dtag = (t >> 16 & 255) - (a >> 16 & 255);
			var dtab = (t >> 8 & 255) - (a >> 8 & 255);
			total = total - (dtbr * dtbr + dtbg * dtbg + dtbb * dtbb);
			total = total + (dtar * dtar + dtag * dtag + dtab * dtab);
		}
	}
	return Math.sqrt(_$UInt_UInt_$Impl_$.toFloat(total) / _$UInt_UInt_$Impl_$.toFloat(rgbCount)) / 255;
};
primitive_Primitive.bestHillClimbState = function(shapes,alpha,n,age,m,target,current,buffer,lastScore) {
	var bestEnergy = 0;
	var bestState = null;
	var _g = 0;
	while(_g < m) {
		var i = _g++;
		var state = primitive_Primitive.bestRandomState(shapes,alpha,n,target,current,buffer,lastScore);
		var before = state.energy(lastScore);
		state = primitive_Primitive.hillClimb(state,age,lastScore);
		var energy = state.energy(lastScore);
		if(i == 0 || energy < bestEnergy) {
			bestEnergy = energy;
			bestState = state;
		}
	}
	return bestState;
};
primitive_Primitive.bestRandomState = function(shapes,alpha,n,target,current,buffer,lastScore) {
	var bestEnergy = 0;
	var bestState = null;
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		var state = new primitive_State(primitive_shape_ShapeFactory.randomShapeOf(shapes,current.width,current.height),alpha,target,current,buffer);
		var energy = state.energy(lastScore);
		if(i == 0 || energy < bestEnergy) {
			bestEnergy = energy;
			bestState = state;
		}
	}
	return bestState;
};
primitive_Primitive.hillClimb = function(state,maxAge,lastScore) {
	if(!(state != null)) throw new js__$Boot_HaxeError("FAIL: state != null");
	if(!(maxAge >= 0)) throw new js__$Boot_HaxeError("FAIL: maxAge >= 0");
	var state1 = state.clone();
	var bestState = state1.clone();
	var bestEnergy = state1.energy(lastScore);
	var age = 0;
	while(age < maxAge) {
		var undo = state1.mutate();
		var energy = state1.energy(lastScore);
		if(energy >= bestEnergy) state1 = undo; else {
			bestEnergy = energy;
			bestState = state1.clone();
			age = -1;
		}
		age++;
	}
	return bestState;
};
primitive_Primitive.getAverageImageColor = function(image) {
	if(!(image != null)) throw new js__$Boot_HaxeError("FAIL: image != null");
	var totalRed = 0;
	var totalGreen = 0;
	var totalBlue = 0;
	var _g1 = 0;
	var _g = image.width;
	while(_g1 < _g) {
		var x = _g1++;
		var _g3 = 0;
		var _g2 = image.height;
		while(_g3 < _g2) {
			var y = _g3++;
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
	return ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = red < 0?0:red > 255?255:red;
		return $r;
	}(this)) << 24) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = green < 0?0:green > 255?255:green;
		return $r;
	}(this)) << 16) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = blue < 0?0:blue > 255?255:blue;
		return $r;
	}(this)) << 8) + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = 255;
		return $r;
	}(this));
};
var primitive_Scanline = function(y,x1,x2,alpha) {
	this.y = y;
	this.x1 = x1;
	this.x2 = x2;
	this.alpha = alpha;
};
primitive_Scanline.__name__ = true;
primitive_Scanline.trim = function(scanlines,w,h) {
	if(!(scanlines != null)) throw new js__$Boot_HaxeError("FAIL: scanlines != null");
	return scanlines.filter((function(f,w1,h1) {
		return function(a1) {
			return f(a1,w1,h1);
		};
	})(primitive_Scanline.trimHelper,w,h));
};
primitive_Scanline.trimHelper = function(line,w,h) {
	if(line.y < 0 || line.y >= h || line.x1 > w || line.x2 < 0) return false;
	line.x1 = primitive_Util.clamp(line.x1,0,w - 1);
	line.x2 = primitive_Util.clamp(line.x2,0,w - 1);
	if(line.x1 > line.x2) return false;
	return true;
};
primitive_Scanline.prototype = {
	__class__: primitive_Scanline
};
var primitive_State = function(shape,alpha,target,current,buffer) {
	if(!(shape != null)) throw new js__$Boot_HaxeError("FAIL: shape != null");
	this.shape = shape;
	this.alpha = alpha;
	this.score = -1;
	this.target = target;
	this.current = current;
	this.buffer = buffer;
};
primitive_State.__name__ = true;
primitive_State.prototype = {
	energy: function(lastScore) {
		if(this.score < 0) this.score = primitive_Primitive.energy(this.shape,this.alpha,this.target,this.current,this.buffer,lastScore);
		return this.score;
	}
	,mutate: function() {
		var oldState = this.clone();
		this.shape.mutate();
		return oldState;
	}
	,clone: function() {
		return new primitive_State(this.shape.clone(),this.alpha,this.target,this.current,this.buffer);
	}
	,__class__: primitive_State
};
var primitive_Util = function() { };
primitive_Util.__name__ = true;
primitive_Util.clamp = function(value,min,max) {
	if(!(min <= max)) throw new js__$Boot_HaxeError("FAIL: min <= max");
	if(value < min) return min; else if(value > max) return max; else return value;
};
primitive_Util.min = function(first,second) {
	if(first < second) return first; else return second;
};
primitive_Util.max = function(first,second) {
	if(first > second) return first; else return second;
};
primitive_Util.toRadians = function(degrees) {
	return degrees * Math.PI / 180;
};
primitive_Util.toDegrees = function(radians) {
	return radians * 180 / Math.PI;
};
primitive_Util.random = function(lower,upper) {
	if(!(lower <= upper)) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
	return lower + Math.floor((upper - lower + 1) * Math.random());
};
primitive_Util.randomArrayItem = function(a) {
	if(!(a != null && a.length > 0)) throw new js__$Boot_HaxeError("FAIL: a != null && a.length > 0");
	return a[primitive_Util.random(0,a.length - 1)];
};
var primitive_bitmap_Bitmap = function() {
};
primitive_bitmap_Bitmap.__name__ = true;
primitive_bitmap_Bitmap.create = function(w,h,color) {
	var bitmap = new primitive_bitmap_Bitmap();
	bitmap.width = w;
	bitmap.height = h;
	var this1;
	this1 = new Array(w * h);
	bitmap.data = this1;
	var i = 0;
	while(i < bitmap.data.length) {
		bitmap.data[i] = color;
		i++;
	}
	return bitmap;
};
primitive_bitmap_Bitmap.createFromBytes = function(w,h,bytes) {
	var bitmap = new primitive_bitmap_Bitmap();
	if(!(bytes != null)) throw new js__$Boot_HaxeError("FAIL: bytes != null");
	var actual = bytes.length;
	var expected = w * h * 4;
	if(actual != expected) throw new js__$Boot_HaxeError("FAIL: values are not equal (expected: " + expected + ", actual: " + actual + ")");
	bitmap.width = w;
	bitmap.height = h;
	var this1;
	this1 = new Array(bytes.length / 4 | 0);
	bitmap.data = this1;
	var i = 0;
	var x = 0;
	while(i < bytes.length) {
		var val;
		var red = bytes.b[i];
		var green = bytes.b[i + 1];
		var blue = bytes.b[i + 2];
		var alpha = bytes.b[i + 3];
		val = ((function($this) {
			var $r;
			if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
			$r = red < 0?0:red > 255?255:red;
			return $r;
		}(this)) << 24) + ((function($this) {
			var $r;
			if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
			$r = green < 0?0:green > 255?255:green;
			return $r;
		}(this)) << 16) + ((function($this) {
			var $r;
			if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
			$r = blue < 0?0:blue > 255?255:blue;
			return $r;
		}(this)) << 8) + (function($this) {
			var $r;
			if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
			$r = alpha < 0?0:alpha > 255?255:alpha;
			return $r;
		}(this));
		bitmap.data[x] = val;
		i += 4;
		x++;
	}
	return bitmap;
};
primitive_bitmap_Bitmap.prototype = {
	getPixel: function(x,y) {
		return this.data[this.width * y + x];
	}
	,setPixel: function(x,y,color) {
		this.data[this.width * y + x] = color;
	}
	,clone: function() {
		var bitmap = new primitive_bitmap_Bitmap();
		bitmap.width = this.width;
		bitmap.height = this.height;
		var this1;
		this1 = new Array(this.data.length);
		bitmap.data = this1;
		var _g1 = 0;
		var _g = this.data.length;
		while(_g1 < _g) {
			var i = _g1++;
			bitmap.data[i] = this.data[i];
		}
		return bitmap;
	}
	,getBytes: function() {
		var bytes = haxe_io_Bytes.alloc(this.data.length * 4);
		var i = 0;
		while(i < this.data.length) {
			var idx = i * 4;
			bytes.b[idx] = this.data[i] >> 24 & 255 & 255;
			bytes.b[idx + 1] = this.data[i] >> 16 & 255 & 255;
			bytes.b[idx + 2] = this.data[i] >> 8 & 255 & 255;
			bytes.b[idx + 3] = this.data[i] & 255 & 255;
			i++;
		}
		return bytes;
	}
	,__class__: primitive_bitmap_Bitmap
};
var primitive_bitmap__$Rgba_Rgba_$Impl_$ = {};
primitive_bitmap__$Rgba_Rgba_$Impl_$.__name__ = true;
primitive_bitmap__$Rgba_Rgba_$Impl_$._new = function(rgba) {
	return rgba;
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.create = function(red,green,blue,alpha) {
	return ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = red < 0?0:red > 255?255:red;
		return $r;
	}(this)) << 24) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = green < 0?0:green > 255?255:green;
		return $r;
	}(this)) << 16) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = blue < 0?0:blue > 255?255:blue;
		return $r;
	}(this)) << 8) + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = alpha < 0?0:alpha > 255?255:alpha;
		return $r;
	}(this));
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.add = function(lhs,rhs) {
	var red = (lhs >> 24 & 255) + (rhs >> 24 & 255);
	var green = (lhs >> 16 & 255) + (rhs >> 16 & 255);
	var blue = (lhs >> 8 & 255) + (rhs >> 8 & 255);
	var alpha = (lhs & 255) + (rhs & 255);
	return ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = red < 0?0:red > 255?255:red;
		return $r;
	}(this)) << 24) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = green < 0?0:green > 255?255:green;
		return $r;
	}(this)) << 16) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = blue < 0?0:blue > 255?255:blue;
		return $r;
	}(this)) << 8) + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = alpha < 0?0:alpha > 255?255:alpha;
		return $r;
	}(this));
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.subtract = function(lhs,rhs) {
	var red = (lhs >> 24 & 255) - (rhs >> 24 & 255);
	var green = (lhs >> 16 & 255) - (rhs >> 16 & 255);
	var blue = (lhs >> 8 & 255) - (rhs >> 8 & 255);
	var alpha = (lhs & 255) - (rhs & 255);
	return ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = red < 0?0:red > 255?255:red;
		return $r;
	}(this)) << 24) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = green < 0?0:green > 255?255:green;
		return $r;
	}(this)) << 16) + ((function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = blue < 0?0:blue > 255?255:blue;
		return $r;
	}(this)) << 8) + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: min <= max");
		$r = alpha < 0?0:alpha > 255?255:alpha;
		return $r;
	}(this));
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.fromInt = function(rgba) {
	return rgba;
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.toString = function(this1) {
	return "rgba(" + (this1 >> 24 & 255) + "," + (this1 >> 16 & 255) + "," + (this1 >> 8 & 255) + "," + (this1 & 255) + ")";
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.get_r = function(this1) {
	return this1 >> 24 & 255;
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.get_g = function(this1) {
	return this1 >> 16 & 255;
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.get_b = function(this1) {
	return this1 >> 8 & 255;
};
primitive_bitmap__$Rgba_Rgba_$Impl_$.get_a = function(this1) {
	return this1 & 255;
};
var primitive_runner_ImageRunner = function(inputImage) {
	this.model = null;
	this.model = new primitive_Model(inputImage,primitive_Primitive.getAverageImageColor(inputImage),inputImage.width);
};
primitive_runner_ImageRunner.__name__ = true;
primitive_runner_ImageRunner.prototype = {
	step: function(options) {
		return this.model.step(options.shapeTypes,options.alpha,options.repeats,options.candidateShapesPerStep,options.shapeMutationsPerStep);
	}
	,getImageData: function() {
		if(!(this.model != null)) throw new js__$Boot_HaxeError("FAIL: model != null");
		return this.model.current;
	}
	,get_backgroundColor: function() {
		return this.model.backgroundColor;
	}
	,__class__: primitive_runner_ImageRunner
};
var primitive_runner_ImageRunnerOptions = function(shapeTypes,alpha,repeats,candidateShapesPerStep,shapeMutationsPerStep) {
	if(shapeMutationsPerStep == null) shapeMutationsPerStep = 50;
	if(candidateShapesPerStep == null) candidateShapesPerStep = 100;
	if(repeats == null) repeats = 1;
	if(alpha == null) alpha = 128;
	if(shapeTypes == null) shapeTypes = [primitive_shape_ShapeType.RECTANGLE];
	this.shapeTypes = shapeTypes;
	this.alpha = alpha;
	this.repeats = repeats;
	this.candidateShapesPerStep = candidateShapesPerStep;
	this.shapeMutationsPerStep = shapeMutationsPerStep;
};
primitive_runner_ImageRunnerOptions.__name__ = true;
primitive_runner_ImageRunnerOptions.prototype = {
	__class__: primitive_runner_ImageRunnerOptions
};
var primitive_shape_Shape = function() { };
primitive_shape_Shape.__name__ = true;
primitive_shape_Shape.prototype = {
	__class__: primitive_shape_Shape
};
var primitive_shape_Ellipse = function(xBound,yBound) {
	this.x = Std.random(xBound);
	this.y = Std.random(yBound);
	this.rx = Std.random(32) + 1;
	this.ry = Std.random(32) + 1;
	this.xBound = xBound;
	this.yBound = yBound;
};
primitive_shape_Ellipse.__name__ = true;
primitive_shape_Ellipse.__interfaces__ = [primitive_shape_Shape];
primitive_shape_Ellipse.prototype = {
	rasterize: function() {
		var lines = [];
		var aspect = this.rx / this.ry;
		var w = this.xBound;
		var h = this.yBound;
		var _g1 = 0;
		var _g = this.ry;
		while(_g1 < _g) {
			var dy = _g1++;
			var y1 = this.y - dy;
			var y2 = this.y + dy;
			if((y1 < 0 || y1 >= h) && (y2 < 0 || y2 >= h)) continue;
			var s = Std["int"](Math.sqrt(this.ry * this.ry - dy * dy) * aspect);
			var x1 = this.x - s;
			var x2 = this.x + s;
			if(x1 < 0) x1 = 0;
			if(x2 >= w) x2 = w - 1;
			if(y1 >= 0 && y1 < h) lines.push(new primitive_Scanline(y1,x1,x2,65535));
			if(y2 >= 0 && y2 < h && dy > 0) lines.push(new primitive_Scanline(y2,x1,x2,65535));
		}
		return lines;
	}
	,mutate: function() {
		var r = Std.random(3);
		switch(r) {
		case 0:
			this.x = primitive_Util.clamp(this.x + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.xBound - 1);
			this.y = primitive_Util.clamp(this.y + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.yBound - 1);
			break;
		case 1:
			this.rx = primitive_Util.clamp(this.rx + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),1,this.xBound - 1);
			break;
		case 2:
			this.ry = primitive_Util.clamp(this.ry + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),1,this.xBound - 1);
			break;
		}
	}
	,clone: function() {
		var ellipse = new primitive_shape_Ellipse(this.xBound,this.yBound);
		ellipse.x = this.x;
		ellipse.y = this.y;
		ellipse.rx = this.rx;
		ellipse.ry = this.ry;
		return ellipse;
	}
	,__class__: primitive_shape_Ellipse
};
var primitive_shape_Circle = function(xBound,yBound) {
	primitive_shape_Ellipse.call(this,xBound,yBound);
	this.rx = Std.random(32) + 1;
	this.ry = this.rx;
};
primitive_shape_Circle.__name__ = true;
primitive_shape_Circle.__super__ = primitive_shape_Ellipse;
primitive_shape_Circle.prototype = $extend(primitive_shape_Ellipse.prototype,{
	mutate: function() {
		var r = Std.random(2);
		switch(r) {
		case 0:
			this.x = primitive_Util.clamp(this.x + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.xBound - 1);
			this.y = primitive_Util.clamp(this.y + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.yBound - 1);
			break;
		case 1:
			var r1 = primitive_Util.clamp(this.rx + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),1,this.xBound - 1);
			this.rx = r1;
			this.ry = r1;
			break;
		}
	}
	,clone: function() {
		var circle = new primitive_shape_Circle(this.xBound,this.yBound);
		circle.x = this.x;
		circle.y = this.y;
		circle.rx = this.rx;
		circle.ry = this.ry;
		return circle;
	}
	,__class__: primitive_shape_Circle
});
var primitive_shape_Rectangle = function(xBound,yBound) {
	this.x1 = Std.random(xBound);
	this.y1 = Std.random(yBound);
	this.x2 = primitive_Util.clamp(this.x1 + Std.random(32) + 1,0,xBound);
	this.y2 = primitive_Util.clamp(this.y1 + Std.random(32) + 1,0,yBound);
	this.xBound = xBound;
	this.yBound = yBound;
};
primitive_shape_Rectangle.__name__ = true;
primitive_shape_Rectangle.__interfaces__ = [primitive_shape_Shape];
primitive_shape_Rectangle.prototype = {
	rasterize: function() {
		var lines = [];
		var _g1 = this.y1;
		var _g = this.y2;
		while(_g1 < _g) {
			var y = _g1++;
			if(this.x1 != this.x2) lines.push(new primitive_Scanline(y,primitive_Util.min(this.x1,this.x2),primitive_Util.max(this.x1,this.x2),65535));
		}
		return lines;
	}
	,mutate: function() {
		var r = Std.random(2);
		switch(r) {
		case 0:
			this.x1 = primitive_Util.clamp(this.x1 + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.xBound - 1);
			this.y1 = primitive_Util.clamp(this.y1 + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.yBound - 1);
			break;
		case 1:
			this.x2 = primitive_Util.clamp(this.x2 + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.xBound - 1);
			this.y2 = primitive_Util.clamp(this.y2 + (function($this) {
				var $r;
				if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
				$r = -16 + Math.floor(33 * Math.random());
				return $r;
			}(this)),0,this.yBound - 1);
			break;
		}
	}
	,clone: function() {
		var rectangle = new primitive_shape_Rectangle(this.xBound,this.yBound);
		rectangle.x1 = this.x1;
		rectangle.y1 = this.y1;
		rectangle.x2 = this.x2;
		rectangle.y2 = this.y2;
		return rectangle;
	}
	,__class__: primitive_shape_Rectangle
};
var primitive_shape_RotatedEllipse = function(xBound,yBound) {
	this.x = Std.random(xBound);
	this.y = Std.random(yBound);
	this.rx = Std.random(32) + 1;
	this.ry = Std.random(32) + 1;
	this.angle = Std.random(361);
	this.xBound = xBound;
	this.yBound = yBound;
};
primitive_shape_RotatedEllipse.__name__ = true;
primitive_shape_RotatedEllipse.__interfaces__ = [primitive_shape_Shape];
primitive_shape_RotatedEllipse.prototype = {
	rasterize: function() {
		var lines = [];
		var n = 16;
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			var p1 = i / n;
			var p2 = (i + 1) / n;
			var a1 = p1 * 2 * Math.PI;
			var a2 = p2 * 2 * Math.PI;
			var x0 = this.rx * Math.cos(a1);
			var y0 = this.ry * Math.sin(a1);
			var x1 = this.rx * Math.cos(a1 + (a2 - a1) / 2);
			var y1 = this.ry * Math.sin(a1 + (a2 - a1) / 2);
			var x2 = this.rx * Math.cos(a2);
			var y2 = this.ry * Math.sin(a2);
			var cx = 2 * x1 - x0 / 2 - x2 / 2;
			var cy = 2 * y1 - y0 / 2 - y2 / 2;
		}
		return lines;
	}
	,mutate: function() {
	}
	,clone: function() {
		var ellipse = new primitive_shape_RotatedEllipse(this.xBound,this.yBound);
		return ellipse;
	}
	,__class__: primitive_shape_RotatedEllipse
};
var primitive_shape_RotatedRectangle = function(xBound,yBound) {
};
primitive_shape_RotatedRectangle.__name__ = true;
primitive_shape_RotatedRectangle.__interfaces__ = [primitive_shape_Shape];
primitive_shape_RotatedRectangle.prototype = {
	rasterize: function() {
		return [];
	}
	,mutate: function() {
	}
	,clone: function() {
		return null;
	}
	,__class__: primitive_shape_RotatedRectangle
};
var primitive_shape_ShapeFactory = function() { };
primitive_shape_ShapeFactory.__name__ = true;
primitive_shape_ShapeFactory.create = function(type,xBound,yBound) {
	switch(type[1]) {
	case 0:
		return new primitive_shape_Rectangle(xBound,yBound);
	case 1:
		return new primitive_shape_RotatedRectangle(xBound,yBound);
	case 2:
		return new primitive_shape_Triangle(xBound,yBound);
	case 3:
		return new primitive_shape_Ellipse(xBound,yBound);
	case 4:
		return new primitive_shape_RotatedEllipse(xBound,yBound);
	case 5:
		return new primitive_shape_Circle(xBound,yBound);
	}
};
primitive_shape_ShapeFactory.randomShape = function(xBound,yBound) {
	return primitive_shape_ShapeFactory.create(primitive_Util.randomArrayItem(Type.allEnums(primitive_shape_ShapeType)),xBound,yBound);
};
primitive_shape_ShapeFactory.randomShapeOf = function(types,xBound,yBound) {
	return primitive_shape_ShapeFactory.create((function($this) {
		var $r;
		if(!(types != null && types.length > 0)) throw new js__$Boot_HaxeError("FAIL: a != null && a.length > 0");
		$r = types[primitive_Util.random(0,types.length - 1)];
		return $r;
	}(this)),xBound,yBound);
};
var primitive_shape_ShapeType = { __ename__ : true, __constructs__ : ["RECTANGLE","ROTATED_RECTANGLE","TRIANGLE","ELLIPSE","ROTATED_ELLIPSE","CIRCLE"] };
primitive_shape_ShapeType.RECTANGLE = ["RECTANGLE",0];
primitive_shape_ShapeType.RECTANGLE.toString = $estr;
primitive_shape_ShapeType.RECTANGLE.__enum__ = primitive_shape_ShapeType;
primitive_shape_ShapeType.ROTATED_RECTANGLE = ["ROTATED_RECTANGLE",1];
primitive_shape_ShapeType.ROTATED_RECTANGLE.toString = $estr;
primitive_shape_ShapeType.ROTATED_RECTANGLE.__enum__ = primitive_shape_ShapeType;
primitive_shape_ShapeType.TRIANGLE = ["TRIANGLE",2];
primitive_shape_ShapeType.TRIANGLE.toString = $estr;
primitive_shape_ShapeType.TRIANGLE.__enum__ = primitive_shape_ShapeType;
primitive_shape_ShapeType.ELLIPSE = ["ELLIPSE",3];
primitive_shape_ShapeType.ELLIPSE.toString = $estr;
primitive_shape_ShapeType.ELLIPSE.__enum__ = primitive_shape_ShapeType;
primitive_shape_ShapeType.ROTATED_ELLIPSE = ["ROTATED_ELLIPSE",4];
primitive_shape_ShapeType.ROTATED_ELLIPSE.toString = $estr;
primitive_shape_ShapeType.ROTATED_ELLIPSE.__enum__ = primitive_shape_ShapeType;
primitive_shape_ShapeType.CIRCLE = ["CIRCLE",5];
primitive_shape_ShapeType.CIRCLE.toString = $estr;
primitive_shape_ShapeType.CIRCLE.__enum__ = primitive_shape_ShapeType;
primitive_shape_ShapeType.__empty_constructs__ = [primitive_shape_ShapeType.RECTANGLE,primitive_shape_ShapeType.ROTATED_RECTANGLE,primitive_shape_ShapeType.TRIANGLE,primitive_shape_ShapeType.ELLIPSE,primitive_shape_ShapeType.ROTATED_ELLIPSE,primitive_shape_ShapeType.CIRCLE];
var primitive_shape_Triangle = function(xBound,yBound) {
	this.x1 = Std.random(xBound);
	this.y1 = Std.random(yBound);
	this.x2 = this.x1 + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
		$r = -16 + Math.floor(33 * Math.random());
		return $r;
	}(this));
	this.y2 = this.y1 + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
		$r = -16 + Math.floor(33 * Math.random());
		return $r;
	}(this));
	this.x3 = this.x1 + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
		$r = -16 + Math.floor(33 * Math.random());
		return $r;
	}(this));
	this.y3 = this.y1 + (function($this) {
		var $r;
		if(!true) throw new js__$Boot_HaxeError("FAIL: lower <= upper");
		$r = -16 + Math.floor(33 * Math.random());
		return $r;
	}(this));
	this.xBound = xBound;
	this.yBound = yBound;
};
primitive_shape_Triangle.__name__ = true;
primitive_shape_Triangle.__interfaces__ = [primitive_shape_Shape];
primitive_shape_Triangle.prototype = {
	rasterize: function() {
		return [];
	}
	,mutate: function() {
	}
	,clone: function() {
		var triangle = new primitive_shape_Triangle(this.xBound,this.yBound);
		triangle.x1 = this.x1;
		triangle.y1 = this.y1;
		triangle.x2 = this.x2;
		triangle.y2 = this.y2;
		triangle.x3 = this.x3;
		triangle.y3 = this.y3;
		return triangle;
	}
	,__class__: primitive_shape_Triangle
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
ID.header = "header";
ID.accordion = "accordion";
ID.shapeopacity = "shapeopacity";
ID.randomshapesperstep = "randomshapesperstep";
ID.shapemutationsperstep = "shapemutationsperstep";
ID.reducedsearchiterations = "reducedsearchiterations";
ID.mintimeperstep = "mintimeperstep";
ID.rectangles = "rectangles";
ID.triangles = "triangles";
ID.ellipses = "ellipses";
ID.circles = "circles";
ID.controls = "controls";
ID.runpausebutton = "runpausebutton";
ID.stepbutton = "stepbutton";
ID.openimagebutton = "openimagebutton";
ID.resetoptions = "resetoptions";
ID.resetbutton = "resetbutton";
ID.saveoptions = "saveoptions";
ID.saveimagebutton = "saveimagebutton";
Main.WEBSITE_URL = "http://www.samcodes.co.uk/project/primitive-haxe/";
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
