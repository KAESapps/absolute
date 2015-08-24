var compose = require('ksf/utils/compose');
var _ContentDelegate = require('./_ContentDelegate');
var Mousable = require('./Mousable');

module.exports = compose(_ContentDelegate, function(content) {
	this._content = new Mousable(content).cursor('pointer');
	this.clickArea = this._content.clickArea;
}, {
	onAction: function(cb, key) {
		this._content.on('click', cb, key);
		return this;
	},
	offAction: function(key) {
		this._content.off(key);
		return this;
	},
});
