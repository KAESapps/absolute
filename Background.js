var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var _ContentDelegate = require('./_ContentDelegate');
var capitalize = require('lodash/string/capitalize');

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
	opacity: function(value) {
		this._bg.styleProp('opacity', value);
		return this;		
	},
	border: function(border) {
		if (typeof border === 'string') {
			this._bg.styleProp('border', border);
		} else {
			for (var p in border) {
				this._bg.styleProp('border' + capitalize(p), border[p]);
			}
		}
		return this;
	},
});
