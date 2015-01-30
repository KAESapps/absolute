var compose = require('ksf/utils/compose');


module.exports = compose(function() {
	this._children = {};
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		this._children[key] = cmp;
		cmp.parentNode(this._parentNode);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._children[key];
		cmp.parentNode(null);
		delete this._children[key];
		return cmp;
	},
	parentNode: function(node) {
		if (arguments.length) {
			this._parentNode = node;
			var children = this._children;
			Object.keys(children).forEach(function(key) {
				children[key].parentNode(node);
			});
			return this;
		} else {
			return this._parentNode;
		}
	},
	visible: function(visible) {
		if (arguments.length) {
			this._visible = visible;
			Object.keys(this._children).forEach(this._applyVisible, this);
			return this;
		} else {
			return this._visible;
		}
	},
	_insertInParentNode: function(key) {
		var cmp = this._children[key];
		cmp.parentNode(this._parentNode);
	},
	_removeFromParentNode: function(key) {
		var cmp = this._children[key];
		cmp.parentNode(null);
	},
	_applyVisible: function(key) {
		var cmp = this._children[key];
		cmp.visible(this._visible);
	},
});