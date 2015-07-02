var compose = require('ksf/utils/compose');
var _InputElement = require('./_InputElement');

module.exports = compose(_InputElement, function() {
	this.prop('type', 'text');
}, {
	_setValue: function(value) {
		this.prop('value', (typeof value === 'string' ? value : ''));
	},
	_getValue: function() {
		return this.prop('value');
	},
});
