var compose = require('ksf/utils/compose');
var FocusableElement = require('./FocusableElement');

module.exports = compose(FocusableElement.prototype, function(args) {
	FocusableElement.call(this, 'input');
	this._asYouType = args && args.asYouType;

	// callbacks mapping
	this._inputCbMap = [];
}, {
	value: function(value) {
		if (arguments.length) {
			this._setValue(value);
			return this;
		} else {
			return this._getValue();
		}
	},
	onInput: function(cb) {
		var self = this;
		var inputCb = function() {
			cb(self._getValue());
		};
		this.on(this._asYouType ? 'input' : 'change', inputCb);
		this._inputCbMap.push([cb, inputCb]);
		return this;
	},
	offInput: function(cb) {
		var inputCb;
		var inputCbMap = this._inputCbMap
		// TODO: replace with ES6 Map?
		inputCbMap.some(function(couple, index) {
			if (couple[0] === cb) {
				inputCb = couple[1];
				inputCbMap.splice(index, 1);
				return true;
			}
		});

		this.off(this._asYouType ? 'input' : 'change', inputCb);
		return this;
	},
});
