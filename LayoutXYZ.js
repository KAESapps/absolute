var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');
var Container = require('./Container');
var objectValues = require('lodash/object/values');

// 
module.exports = compose(function(cmps, xLayoutCb, yLayoutCb, zLayoutCb) {
	this._container = new Container(objectValues(cmps));
	this._xLayout = xLayoutCb(cmps);
	this._yLayout = yLayoutCb(cmps);
	this._zLayout = zLayoutCb(cmps);
}, {
	width: delegateGetSet('_xLayout', 'size'),
	height: delegateGetSet('_yLayout', 'size'),
	depth: delegateGetSet('_zLayout', 'size'),
	left: delegateGetSet('_xLayout', 'position'),
	top: delegateGetSet('_yLayout', 'position'),
	zIndex: delegateGetSet('_zLayout', 'position'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	visible: delegateGetSet('_container', 'visible'),
});