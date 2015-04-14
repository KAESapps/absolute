var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function() {
	this._content = new Elmt('button').styleProp('font', 'inherit');
	this._content.styleProp('cursor', 'pointer');
}, {
	value: function(value) {
		this._content.prop('textContent', (typeof value === 'string' ? value : ''));
		return this;
	},
	onAction: function(cb, key) {
		this._content.on('click', cb);
		this._own(cb, key);
		return this;
	},
	offAction: function(key) {
		var cb = this._owned[key];
		this._unown(key);
		this._content.off('click', cb);
		return this;
	},
	color: function(color) {
		this._content.style({
			backgroundColor: color,
			borderColor: color
		});
		return this;
	},
});
