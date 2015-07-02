var compose = require('ksf/utils/compose');
var Element = require('./Element');
var _Evented = require('ksf/base/_Evented');

module.exports = compose(Element, _Evented, function() {
	this.prop('tabIndex', -1).style({ outline: 'none' });
	var self = this;
	this.on('focus', function() {
		self._focus = true;
		self._emit('focus', true);
	});
	this.on('blur', function() {
		if (document.activeElement !== self.domNode) {
			self._focus = false;
			self._emit('focus', false);
		}
	});
	this._focus = false;
}, {
	onFocus: function(cb) {
		this._on('focus', cb);
		return this;
	},
	offFocus: function(cb) {
		// TODO
	},
	focus: function(focus) {
		if (arguments.length) {
			this._focus = focus;
			this.domNode[focus ? 'focus' : 'blur']();
		} else {
			return this._focus;
		}
	}
});
