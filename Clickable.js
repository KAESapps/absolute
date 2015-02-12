var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	this._clickArea = new Elmt().styleProp('cursor', 'pointer');
	this._content = new ZPile().content([
		content,
		this._clickArea
	]);
}, {
	onAction: function(cb, key) {
		this._clickArea.on('click', cb);
		this._own(cb, key);
		return this;
	},
	offAction: function(key) {
		var cb = this._owned[key];
		this._unown(key);
		this._clickArea.off('click', cb);
		return this;
	},
});
