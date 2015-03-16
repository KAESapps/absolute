var compose = require('ksf/utils/compose');

var delegateStore = function(prop) {
	return function(value) {
		if (arguments.length) {
			this._store[prop] = value;
			return this;
		} else {
			return this._store[prop];
		}
	};
};

module.exports = compose(function(size) {
	this._size = size;
	this._store = {};
}, {
	left: delegateStore('left'),
	top: delegateStore('top'),
	zIndex: delegateStore('zIndex'),
	width: delegateStore('width'),
	height: delegateStore('height'),
	depth: function() { return 0; },
	parentNode: delegateStore('parentNode'),
});