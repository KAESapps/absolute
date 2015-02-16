var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	this._bg = new Elmt();
	this._content = new ZPile().content([
		this._bg,
		content
	]);
}, {
	color: function(color) {
		this._bg.styleProp('backgroundColor', color);
		return this;
	},
	border: function(border) {
		this._bg.styleProp('border', border);
		return this;
	},
});
