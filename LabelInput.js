var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var FocusableElement = require('./FocusableElement');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = new FocusableElement('input');
	this._content.prop('type', 'text');
	this._asYouType = args && args.asYouType;
}, {
	value: function(value) {
		if (arguments.length) {
			this._content.prop('value', (typeof value === 'string' ? value : ''));
			return this;
		} else {
			return this._content.prop('value');
		}
	},
	onInput: function(cb, key) {
		var self = this;
		this._content.on(this._asYouType ? 'input' : 'change', function() {
			cb(self.value());
		});
		this._own(cb, key);
		return this;
	},
	offInput: function(key) {
		var cb = this._owned[key];
		this._unown(key);
		this._content.off(this._asYouType ? 'input' : 'change', cb);
		return this;
	},
	placeholder: function(placeholder) {
		this._content.prop('placeholder', placeholder);
		return this;
	},
	style: function(style) {
		this._content.style(style);
		return this;
	},
	focus: function(focus) {
		if (arguments.length) {
			this._content.focus(focus);
			return this;
		} else {
			return this._content.focus();
		}
	},
	onFocus: function(cb) {
		this._content.onFocus(cb);
		return this;
	},
	offFocus: function(cb) {
		this._content.offFocus(cb);
		return this;
	},
	onKeyDown: function(cb) {
		this._content.on('keydown', cb);
		return this;
	}
});
