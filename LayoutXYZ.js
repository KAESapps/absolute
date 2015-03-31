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
	parentNode: delegateGetSet('_container', 'parentNode'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
	width: delegateGetSet('_xLayout', 'size'),
	height: delegateGetSet('_yLayout', 'size'),
	depth: delegateGetSet('_zLayout', 'size'),
	left: delegateGetSet('_xLayout', 'position'),
	top: delegateGetSet('_yLayout', 'position'),
	zIndex: delegateGetSet('_zLayout', 'position'),
	visible: delegateGetSet('_container', 'visible'),
});