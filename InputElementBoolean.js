var compose = require('ksf/utils/compose');
var _InputElement = require('./_InputElement');

module.exports = compose(_InputElement, function() {
	this.prop('type', 'checkbox');
	this.prop('indeterminate', 'true');
}, {
	_getValue: function() {
	if (this.prop('indeterminate')) {
		return null;
	}
	return this.prop('checked');
	},
	_setValue: function(value) {
		if (value === null) {
			this.prop('indeterminate', true); // display null value
		} else {
			this.prop('indeterminate', false); // display null value
			this.prop('checked', !!value);
		}
	},

});
