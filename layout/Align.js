var compose = require('ksf/utils/compose');

/**
Layouter qui positionne un enfant de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, content, align) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._content = content;
	this._align = align;
	this._contentSize = this._content[this._sizeProp]();
}, {
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			this._calculateContentOffset();
			this._positionContent();
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._positionContent();
		} else {
			return this._position;
		}
	},
	_positionContent: function() {
		if (this._position !== null && this._contentOffset !== null) {
			this._content[this._positionProp](this._position + this._contentOffset);
		}
	},
	_calculateContentOffset: function() {
		if (this._align === 'head') {
			this._contentOffset = 0;
		}
		if (this._align === 'middle') {
			this._contentOffset = Math.round((this._size / 2) - (this._contentSize / 2));
		}
		if (this._align === 'tail') {
			this._contentOffset = this._size - this._contentSize;
		}
	},
});