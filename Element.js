var compose = require('ksf/utils/compose');
var Style = require('ksf/dom/style/Style');

var baseStyle = new Style('#this { \
	position: absolute;	\
	box-sizing: border-box;' +
	// est-ce nécessaire de le forcer au démarrage ?
	'display: block;' +
	// nécessaire pour les cas où cet élément est ajouté dans un dom-node avec pointer-events: none (transparent)	\
	'pointer-events: auto;	\
	font: inherit;	\
}');

module.exports = compose(function(tag, namespace) {
	var node;
	if (namespace) {
		node = this.domNode = document.createElementNS(namespace, tag);
	} else {
		node = this.domNode = document.createElement(tag || 'div');
	}
	this._visible = true;
	baseStyle.apply(this.domNode);
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
			this._applyVisible();
			return this;
		} else {
			return this._visible;
		}
	},
	containerVisible: function(visible) {
		this._containerVisible = visible;
		this._applyVisible();
		return this;
	},
	_applyVisible: function() {
		if (this._containerVisible === undefined) { return; }
		this.domNode.style.display = (this._containerVisible && this._visible) ? '' : 'none';
	},
	attr: function(attr, value) {
		this.domNode.setAttribute(attr, value);
		return this;
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
	on: function(type, cb, capture) {
		this.domNode.addEventListener(type, cb, capture);
		return this;
	},
	off: function(type, cb, capture) {
		this.domNode.removeEventListener(type, cb, capture);
		return this;
	},
});
