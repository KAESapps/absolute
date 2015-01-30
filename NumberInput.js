var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function() {
	this._content = new Elmt('input');
	this._content.prop('type', 'number');
}, {
	value: function(value) {
		if (arguments.length) {
			this._content.prop('valueAsNumber', value);
			return this;
		} else {
			return this._content.prop('valueAsNumber');
		}
	},
	onInput: function(cb, key) {
		var self = this;
		this._content.on('change', function() {
			cb(self.value());
		});
		this._own(cb, key);
		return this;
	},
	offInput: function(key) {
		var cb = this._owned[key];
		this._unown(key);
		this._content.off('change', cb);
		return this;
	},
});
