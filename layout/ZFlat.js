var compose = require('ksf/utils/compose');
/**
Layouter qui positionne tous les enfants à la même position et a comme dimension celle du plus grand enfant (mais ne diminue jamais de taille car en z ça ne sert à rien)
TODO: le rendre réactif
*/
module.exports = compose(function() {
	this._children = {};
	this._size = 0;
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		// TODO: remove check in build?
		if (key in this._children) {
			throw 'key already used';
		}
		this._children[key] = cmp;
		this._applyPosition(key);
		this._updateSize(key);
	},
	remove: function(key) {
		delete this._children[key];
	},
	_updateSize: function(key) {
		var cmpSize = this._children[key].depth();
		if (cmpSize > this._size) {
			this._size = cmpSize;
		}
	},
	_applyPosition: function(key) {
		if (typeof this._position === 'number') {
			this._children[key].zIndex(this._position);
		}
	},
	size: function() {
		return this._size;
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			Object.keys(this._children).forEach(this._applyPosition, this);
			return this;
		} else {
			return this._position;
		}
	},
});
