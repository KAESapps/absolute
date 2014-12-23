var compose = require('ksf/utils/compose');

/**
Layouter qui dimensionne et positionne des enfants de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, children) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._children = children;
	this._initLayout();
}, {
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			this._applySize();
			return this;
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._applyPosition();
			return this;
		} else {
			return this._position;
		}
	},
	_initLayout: function() {
		var sizeProp = this._sizeProp;
		var children = this._children;
		this._totalFixedSize = 0;
		this._totalFlexWeight = 0;
		this._flexChildren = [];
		var child;
		for (var i = children.length - 1; i >= 0; i--) {
			child = children[i];
			if (child.type === 'flex') {
				this._flexChildren.push(child);
				this._totalFlexWeight += child.weight;
			} else {
				child.size = child.cmp[sizeProp]();
				this._totalFixedSize += child.size;
			}
		}
		this._applySize();
	},
	_applySize: function() {
		// only change size of flex children
		if (this._size !== null) {
			var child;
			var sizeProp = this._sizeProp;
			var flexChildren = this._flexChildren;
			var totalFlexSize = this._size - this._totalFixedSize;
			var remainingRounding = totalFlexSize % this._totalFlexWeight;
			var roundingPerFlexUnit = remainingRounding / this._totalFlexWeight;
			var sizePerFlexUnit = (totalFlexSize - remainingRounding) / this._totalFlexWeight;
			for (var i = flexChildren.length - 1; i >= 0; i--) {
				child = flexChildren[i];
				child.size = child.weight * sizePerFlexUnit;
				// on essaie de répartir l'arrondi en proportion de chaque enfant jusqu'à ce qu'il n'y en ai plus
				if (remainingRounding > 0) {
					var childRounding = Math.ceil(roundingPerFlexUnit * child.weight);
					if (childRounding > remainingRounding) {
						childRounding = remainingRounding;
					}
					child.size += childRounding;
					remainingRounding -= childRounding;
				}
				child.cmp[sizeProp](child.size);
			}
			this._applyPosition();
		}
	},
	_applyPosition: function() {
		if (this._position !== null) {
			var children = this._children;
			var positionProp = this._positionProp;
			var child;
			var position = this._position;
			for (var i = 0; i < children.length; i++) {
				child = children[i];
				child.cmp[positionProp](position);
				position += child.size;
			}
		}
	},
});