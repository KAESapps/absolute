var compose = require('ksf/utils/compose');


module.exports = compose(function(content) {
	this._content = content;
	this._visible = true;
}, {
	parentNode: function(node) {
		if (arguments.length) {
			this._parentNode = node;
			this._content.forEach(function(cmp) {
				cmp.parentNode(node);
			});
			return this;
		} else {
			return this._parentNode;
		}
	},
	containerVisible: function(containerVisible) {
		this._containerVisible = containerVisible;
		this._applyVisible();
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
	_applyVisible: function() {
		if (this._containerVisible === undefined) { return; }
		var visible = this._containerVisible && this._visible;
		this._content.forEach(function(cmp) {
			cmp.containerVisible(visible);
		});
	},
});