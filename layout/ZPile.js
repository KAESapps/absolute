var compose = require('ksf/utils/compose');
/**
Layouter qui positionne tous les enfants à la même position et a comme dimension celle du plus grand enfant (mais ne diminue jamais de taille car en z ça ne sert à rien)
TODO: le rendre réactif
*/
module.exports = compose(function() {
	this._children = {};
	this._childrenOrder = [];
	this._size = 0;
	this._position = 0;
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		cmps.forEach(function(cmpInfo) {
			this.add(cmpInfo.key, cmpInfo.cmp);
		}, this);
		return this;
	},
	add: function(key, cmp, beforeKey) {
		this._children[key] = cmp;
		var before = this._children[beforeKey];
		if (before) {
			var beforeIndex = this._childrenOrder.indexOf(before);
			cmp.zIndex(before.zIndex());
			var nextZIndex = before.zIndex() + cmp.depth();
			this._childrenOrder.slice(beforeIndex).forEach(function(nextCmp) {
				nextCmp.zIndex(nextZIndex);
				nextZIndex += nextCmp.depth();
			}, this);
			this._childrenOrder.splice(beforeIndex, 0, cmp);
		} else {
			cmp.zIndex(this._position + this._size);
			this._childrenOrder.push(cmp);
		}
		this._size += cmp.depth();
	},
	remove: function(key) {
		var cmp = this._children[key];
		this._childrenOrder.splice(this._childrenOrder.indexOf(cmp), 1);
		delete this._children[key];
	},
	size: function() {
		return this._size;
	},
	position: function(position) {
		if (arguments.length) {
			var delta = position - this._position;
			this._position = position;
			this._childrenOrder.forEach(function(cmp) {
				cmp.zIndex(cmp.zIndex() + delta);
			});
			return this;
		} else {
			return this._position;
		}
	},
});