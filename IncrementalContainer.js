var compose = require('ksf/utils/compose');


module.exports = compose(function() {
	this._children = {};
	this._visible = true;
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
		this._applyChildVisible(cmp);
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
	_applyChildVisible: function(child) {
		if (this._containerVisible === undefined) { return; }
		child.containerVisible(this._containerVisible && this._visible);
	},
	containerVisible: function(visible) {
		this._containerVisible = visible;
		Object.keys(this._children).forEach(function(key) {
			this._applyChildVisible(this._children[key]);
		}, this);
		return this;
	},
	visible: function(visible) {
		this._visible = visible;
		Object.keys(this._children).forEach(function(key) {
			this._applyChildVisible(this._children[key]);
		}, this);
		return this;
	},
});