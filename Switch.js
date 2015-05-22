var compose = require('ksf/utils/compose');

function contentGetSet (prop) {
	return function(value) {
		if (arguments.length) {
			this._props[prop] = value;
			this._content && this._content[prop](value);
			return this;
		} else {
			return this._props[prop];
		}
	};
}

module.exports = compose(function() {
	this._props = {};
}, {
	content: function(content) {
		if (this._content && this._props.parentNode) {
			this._content.parentNode(null);
		}
		this._content = content;
		if (content) {
			for (var prop in this._props) {
				this._content[prop](this._props[prop]);
			}
		}
		return this;
	},
	width: contentGetSet('width'),
	height: contentGetSet('height'),
	depth: contentGetSet('depth'),
	left: contentGetSet('left'),
	top: contentGetSet('top'),
	zIndex: contentGetSet('zIndex'),
	parentNode: contentGetSet('parentNode'),
	visible: contentGetSet('visible'),
	containerVisible: contentGetSet('containerVisible'),
});