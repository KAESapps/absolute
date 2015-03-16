var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Full = require('./Full');
var delegateGetSet = require('../utils/delegateGetSet');
var capitalize = require('lodash/string/capitalize');

module.exports = compose(_Destroyable, function(axis, master) {
	this._master = master;
	var contentLayout = this._contentLayout = new Full(axis);
	
	var sizeProp = this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	var onSizeMethod = 'on' + capitalize(sizeProp);
	
	contentLayout.size(master[sizeProp]());
	this._own(master[onSizeMethod](function(size) {
		contentLayout.size(size);
	}));
}, {
	content: function(cmps) {
		this._contentLayout.content(cmps.concat([this._master]));
		return this;
	},
	size: function() {
		return this._master[this._sizeProp]();
	},
	position: delegateGetSet('_contentLayout', 'position'),
});