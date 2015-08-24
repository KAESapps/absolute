var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	this.clickArea = new Elmt();
	this._content = new ZPile().content([
		content,
		this.clickArea
	]);
}, {
	cursor: function(cursorType) {
		this.clickArea.styleProp('cursor', cursorType);
		return this;
	},
	on: function(domEventName, cb, key) {
		this.clickArea.on(domEventName, cb);
		this._own({
			eventName: domEventName,
			cb: cb
		}, key);
		return this;
	},
	off: function(key) {
		var ev = this._owned[key];
		this._unown(key);
		this.clickArea.off(ev.eventName, ev.cb);
		return this;
	},
});
