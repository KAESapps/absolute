var compose = require('ksf/utils/compose');


module.exports = compose(function(content) {
	this._content = content;
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
	visible: function(visible) {
		if (arguments.length) {
			this._visible = visible;
			this._content.forEach(function(cmp) {
				cmp.visible(visible);
			});
			return this;
		} else {
			return this._visible;
		}
	},
});