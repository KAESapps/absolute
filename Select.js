var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

// select natif avec une liste d'options non dynamique
module.exports = compose(_Destroyable, _ContentDelegate, function(options) {
	this._content = new Elmt('select').styleProp('font', 'inherit');
	var option, optionNode;
	for (var i = 0; i < options.length; i++) {
		option = options[i];
		optionNode = document.createElement('option');
		optionNode.value = option[0];
		optionNode.textContent = option[1];
		this._content.domNode.appendChild(optionNode);
	}
}, {
	value: function(value) {
		if (arguments.length) {
			if (typeof value === 'string') {
				this._content.prop('value', value);
			} else {
				this._content.prop('selectedIndex', -1);
			}
			return this;
		} else {
			return this._content.prop('value');
		}
	},
	onInput: function(cb) {
		var self = this;
		this._content.on('change', function() {
			cb(self.value());
		});
		return this;
	},
	offInput: function(cb) {
		this._content.off('change', cb);
		return this;
	},
});
