var compose = require('ksf/utils/compose');

module.exports = compose(function(tag, namespace) {
	var node;
	if (namespace) {
		node = this.domNode = document.createElementNS(namespace, tag);
	} else {
		node = this.domNode = document.createElement(tag || 'div');
	}
	node.style.position = 'absolute';
	node.style.boxSizing = 'border-box';
	node.style.display = 'block'; // est-ce nécessaire de le forcer au démarrage ?
	this._visible = true;
}, {
	left: function(left) {
		if (arguments.length) {
			this._left = left;
			this.domNode.style.left = left+'px';
			return this;
		} else {
			return this._left;
		}
	},
	top: function(top) {
		if (arguments.length) {
			this._top = top;
			this.domNode.style.top = top+'px';
			return this;
		} else {
			return this._top;
		}
	},
	zIndex: function(zIndex) {
		if (arguments.length) {
			this._zIndex = zIndex;
			this.domNode.style.zIndex = zIndex;
			return this;
		} else {
			return this._zIndex;
		}
	},
	width: function(width) {
		if (arguments.length) {
			this._width = width;
			this.domNode.style.width = width+'px';
			return this;
		} else {
			return this._width;
		}
	},
	height: function(height) {
		if (arguments.length) {
			this._height = height;
			this.domNode.style.height = height+'px';
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
				parentNode.appendChild(this.domNode);
			} else {
				this._parentNode && this._parentNode.removeChild(this.domNode);
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
			this.domNode.style.display = (visible ? 'block' : 'none');
			return this;
		} else {
			return this._visible;
		}
	},
	attr: function(attr, value) {
		this.domNode.setAttribute(attr, value);
	},
	attrs: function(attrs) {
		Object.keys(attrs).forEach(function(attr) {
			this.attr(attr, attrs[attr]);
		}, this);
		return this;
	},
	prop: function(prop, value) {
		if (arguments.length === 2) {
			this.domNode[prop] = value;
			return this;
		} else {
			return this.domNode[prop];
		}
	},
	props: function(props) {
		Object.keys(props).forEach(function(prop) {
			this.prop(prop, props[prop]);
		}, this);
		return this;
	},
	styleProp: function(prop, value) {
		this.domNode.style[prop] = value;
		return this;
	},
	style: function(style) {
		Object.keys(style).forEach(function(prop) {
			this.styleProp(prop, style[prop]);
		}, this);
		return this;
	},
	on: function(type, cb) {
		this.domNode.addEventListener(type, cb);
	},
	off: function(type, cb) {
		this.domNode.removeEventListener(type, cb);
	},
});
