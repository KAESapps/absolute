var compose = require('ksf/utils/compose');
var capitalize = require('lodash/string/capitalize');

/**
Layouter qui dimensionne et positionne un enfant de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, content, headMarge, tailMarge) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._onSizeMethod = 'on' + capitalize(this._sizeProp);
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._content = content;
	this._headMarge = headMarge || 0;
	this._tailMarge = tailMarge || 0;
}, {
	size: function() {
		return this._content[this._sizeProp]() + this._headMarge + this._tailMarge;
	},
	onSize: function(cb) {
		return this._content[this._onSizeMethod](function() {
			cb(this.size());
		}.bind(this));
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._positionContent();
			return this;
		} else {
			return this._position;
		}
	},
	_positionContent: function() {
		this._content[this._positionProp](this._position + this._headMarge);
	},
});