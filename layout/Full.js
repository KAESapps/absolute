var compose = require('ksf/utils/compose');
/**
Layouter qui positionne et dimensionne tous les enfants à la même position et dimension que lui-même
*/
module.exports = compose(function(axis) {
	this._children = {};
	this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	this._positionProp = (axis === 'vertical' ? 'top' : 'left');
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
		this._applySize(key);
		this._applyPosition(key);
	},
	remove: function(key) {
		delete this._children[key];
	},
	_applySize: function(key) {
		if (this._size !== undefined) {
			this._children[key][this._sizeProp](this._size);
		}
	},
	_applyPosition: function(key) {
		if (typeof this._position === 'number') {
			this._children[key][this._positionProp](this._position);
		}
	},
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			Object.keys(this._children).forEach(this._applySize, this);
			return this;
		} else {
			return this._size;
		}
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
