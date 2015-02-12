var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var ZPile = require('./ZPile');
var Align = require('./Align');
var SvgIcon = require('./SvgIcon');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_Destroyable, _ContentDelegate, function() {
	this._content = new ZPile();
	this._clickArea = this._content.add('clickArea', new Elmt()).styleProp('cursor', 'pointer');
}, {
	icon: function(pathInfo, iconSize) {
		this._icon && this._content.remove('icon');
		this._icon = new SvgIcon(pathInfo);
		this._content.add('icon', new Align(this._icon.width(iconSize.width).height(iconSize.height), 'middle', 'middle'), 'clickArea');
		return this;
	},
	color: function(color) {
		this._icon.color(color);
		return this;
	},
	onAction: function(cb, key) {
		this._clickArea.on('click', cb);
		this._own(cb, key);
		return this;
	},
	offAction: function(key) {
		var cb = this._owned[key];
		this._unown(key);
		this._clickArea.off('click', cb);
		return this;
	},
});
