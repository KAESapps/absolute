var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var delegateGetSet = require('./utils/delegateGetSet');

var Flex = require('./layout/Flex');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');
var Container = require('./Container');

function getCmp (arg) {
	return Array.isArray(arg) ? arg[0] : arg;
}

/**
Impose la hauteur à tous les enfants
Demande la largeur aux enfants fixes
Impose la largeur aux enfants flex
*/
module.exports = compose(_Destroyable, function(content) {
	this._container = new Container(content.map(getCmp));
	this._horizontalLayouter = this._own(new Flex('horizontal', content.map(function(arg) {
		if (Array.isArray(arg)) {
			if (typeof arg[1] === 'number') {
				return {
					cmp: arg[0],
					type: 'flex',
					weight: arg[1]
				};
			} else {
				return {
					cmp: arg[0],
					type: arg[1],
				};
			}
		} else {
			return {
				cmp: arg,
				type: 'flex',
				weight: 1,
			};
		}
	})));
	var cmpsAsDict = content.reduce(function(acc, arg, index) {
		acc[index] = getCmp(arg);
		return acc;
	}, {});
	this._verticalLayouter = new Full('vertical').content(cmpsAsDict);
	this._zLayouter = new ZFlat().content(cmpsAsDict);
}, {
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_zLayouter', 'size'),
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_zLayouter', 'position'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	visible: delegateGetSet('_container', 'visible'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
});
