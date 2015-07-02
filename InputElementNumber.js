var compose = require('ksf/utils/compose');
var _InputElement = require('./_InputElement');

module.exports = compose(_InputElement, function() {
	this.prop('type', 'number');
}, {
	_setValue: function(value) {
		this.prop('valueAsNumber', value);
	},
	_getValue: function() {
		return this.prop('valueAsNumber');
	},
});
