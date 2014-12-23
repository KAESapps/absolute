var compose = require('ksf/utils/compose');


module.exports = compose(function() {
	this._children = {};
}, {
	add: function(key, cmp) {
		this._children[key] = cmp;
		this._insertInParentNode(key);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._children[key];
		this._removeFromParentNode(key);
		delete this._children[key];
		return cmp;
	},
	parentNode: function(node) {
		if (arguments.length) {
			this._parentNode = node;
			Object.keys(this._children).forEach(this._insertInParentNode, this);
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