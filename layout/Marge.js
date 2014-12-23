var compose = require('ksf/utils/compose');

/**
Layouter qui dimensionne et positionne un enfant de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, content, headMarge, tailMarge) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._content = content;
	this._headMarge = headMarge;
	this._tailMarge = tailMarge;
}, {
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			this._sizeContent();
			return this;
		} else {
			return this._size;
		}
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
	_sizeContent: function() {
		this._content[this._sizeProp](this._size - (this._headMarge + this._tailMarge));
	},
	_positionContent: function() {
		this._content[this._positionProp](this._position + this._headMarge);
	},
});