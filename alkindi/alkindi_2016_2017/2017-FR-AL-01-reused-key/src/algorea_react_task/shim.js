
// IE8 compatibility:
import 'html5shiv';
import 'es5-shim';
import 'es5-sham-ie8';
// IE9+ compatibility:
import ObjectAssign from 'object.assign';
ObjectAssign.shim();
// Array.prototype.find not available on Chrome
import 'es6-shim';
// Array.prototype.fill not available on IE
import 'array.prototype.fill';
