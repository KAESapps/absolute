var compose = require('ksf/utils/compose');

/**
Container qui positionne des enfants de taille fixe dans un ordre donné.
Peut-être utilisé de façon incrémental
*/
module.exports = compose(function(axis) {
	this._children = {};
	this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	this._positionProp = (axis === 'vertical' ? 'top' : 'left');
	this._firstChildKey = null;
	this._lastChildKey = null;
}, {
	content: function(config) {
		var sizeProp = this._sizeProp;
		var children = this._children = {};
		var offset = 0;
		var previous = null;
		config.forEach(function(child) {
			previous && (children[previous].next = child.key);
			var cmpSize = child.cmp[sizeProp]();
			children[child.key] = {
				previous: previous,
				next: null,
				key: child.key,
				cmp: child.cmp,
				size: cmpSize,
				offset: offset,
			};
			offset += cmpSize;
			previous = child.key;
		}, this);
		this._size = offset;

		this._firstChildKey = config[0].key;
		this._lastChildKey = config[config.length-1].key;
		this._layoutFrom(this._firstChildKey);

		// this._emit('size', this._size);

		return this;
	},
	add: function(key, cmp, beforeKey) {
		beforeKey = beforeKey || null;
		var sizeProp = this._sizeProp;

		var previousKey = beforeKey ? this._children[beforeKey].previous : this._lastChildKey;
		var previousChild = previousKey ? this._children[previousKey] : null;
		var offset = previousChild ? previousChild.offset + previousChild.size : 0;
		var cmpSize = cmp[sizeProp]();
		this._children[key] = {
			previous: previousKey,
			next: beforeKey,
			key: key,
			cmp: cmp,
			size: cmpSize,
			offset: offset,
		};
		previousKey && (this._children[previousKey].next = key);
		beforeKey && (this._children[beforeKey].previous = key);

		this._layoutFrom(key);
		if (beforeKey === this._firstChildKey) {
			this._firstChildKey = key;
		}
		if (beforeKey === null) {
			this._lastChildKey = key;
		}

		this._size = (this._size || 0) + cmpSize;
		// this._emit('size', this._size);
	},
	remove: function(key) {
		var child = this._children[key];

		var previousKey = child.previous;
		var previousChild = previousKey ? this._children[previousKey] : null;

		var nextKey = child.next;
		var nextChild = nextKey ? this._children[nextKey] : null;

		previousChild && (previousChild.next = nextKey);
		nextChild && (nextChild.previous = previousKey);

		this._layoutFrom(nextKey);
		if (previousKey === null) {
			this._firstChildKey = nextKey;
		}
		if (nextKey === null) {
			this._lastChildKey = previousKey;
		}

		delete this._children[key];

		this._size = this._size - child.size;
	},
	move: function(key, beforeKey) {
		// TODO: optimize
		var cmp = this._children[key].cmp;
		this.remove(key);
		this.add(key, cmp, beforeKey);
	},
	_layoutFrom: function(key) {
		var positionProp = this._positionProp;
		var children = this._children;
		while(key) {
			var child = children[key];
			var previousChild = children[child.previous];
			var offset = child.offset = previousChild ? previousChild.offset + previousChild.size : 0;
			child.cmp[positionProp](this._position + offset); // apply offset
			key = child.next;
		}
	},
	children: function() {
		return this._children;
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._layoutFrom(this._firstChildKey);
			return this;
		} else {
			return this._position;
		}
	},
	size: function() {
		return this._size;
	},
	// onSize: function(cb) {
	// 	return this._on('size', cb);
	// },
});
