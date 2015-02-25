var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	this._clickArea = new Elmt();
	this._content = new ZPile().content([
		content,
		this._clickArea
	]);
}, {
	cursor: function(cursorType) {
		this._clickArea.styleProp('cursor', cursorType);
		return this;
	},
	on: function(domEventName, cb, key) {
		this._clickArea.on(domEventName, cb);
		this._own({
			eventName: domEventName,
			cb: cb
		}, key);
		return this;
	},
	off: function(key) {
		var ev = this._owned[key];
		this._unown(key);
		this._clickArea.off(ev.eventName, ev.cb);
		return this;
	},
});
