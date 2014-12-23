var compose = require('ksf/utils/compose');

module.exports = compose(function(tag) {
	var node = this._domNode = document.createElement(tag || 'div');
	node.style.position = 'absolute';
	node.style.boxSizing = 'border-box';
	node.style.display = 'block'; // est-ce nécessaire de le forcer au démarrage ?
	this._visible = true;
}, {
	left: function(left) {
		if (arguments.length) {
			this._left = left;
			this._domNode.style.left = left+'px';
			return this;
		} else {
			return this._left;
		}
	},
	top: function(top) {
		if (arguments.length) {
			this._top = top;
			this._domNode.style.top = top+'px';
			return this;
		} else {
			return this._top;
		}
	},
	zIndex: function(zIndex) {
		if (arguments.length) {
			this._zIndex = zIndex;
			this._domNode.style.zIndex = zIndex;
			return this;
		} else {
			return this._zIndex;
		}
	},
	width: function(width) {
		if (arguments.length) {
			this._width = width;
			this._domNode.style.width = width+'px';
			return this;
		} else {
			return this._width;
		}
	},
	height: function(height) {
		if (arguments.length) {
			this._height = height;
			this._domNode.style.height = height+'px';
			return this;
		} else {
			return this._height;
		}
	},
	depth: function() {
		return 1;
	},
	parentNode: function(parentNode) {
		if (arguments.length) {
			if (parentNode) {
				parentNode.appendChild(this._domNode);
			} else {
				this._parentNode && this._parentNode.removeChild(this._domNode);
			}
			this._parentNode = parentNode;
			return this;
		} else {
			return this._parentNode;
		}
	},
	visible: function(visible) {
		if (arguments.length) {
			this._visible = visible;
			this._domNode.style.display = (visible ? 'block' : 'none');
			return this;
		} else {
			return this._visible;
		}
	},
}, {
	prop: function(prop, value) {
		this._domNode[prop] = value;
		return this;
	},
	props: function(props) {
		Object.keys(props).forEach(function(prop) {
			this.prop(prop, props[prop]);
		}, this);
	},
	styleProp: function(prop, value) {
		this._domNode.style[prop] = value;
	},
	style: function(style) {
		Object.keys(style).forEach(function(prop) {
			this.styleProp(prop, style[prop]);
		}, this);
	},
});
