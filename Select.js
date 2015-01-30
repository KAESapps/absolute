var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

// select natif avec une liste d'options non dynamique
module.exports = compose(_Destroyable, _ContentDelegate, function(options) {
	this._content = new Elmt('select');
	var option, optionNode;
	for (var i = 0; i < options.length; i++) {
		option = options[i];
		optionNode = document.createElement('option');
		optionNode.value = option[0];
		optionNode.textContent = option[1];
		this._content._domNode.appendChild(optionNode);
	}
}, {
	value: function(value) {
		if (arguments.length) {
			if (value) {
				this._content.prop('value', value);				
			} else {
				this._content.prop('selectedIndex', -1);
			}
			return this;
		} else {
			return this._content.prop('value');
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
