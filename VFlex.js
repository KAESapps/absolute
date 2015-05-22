var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Flex = require('./layout/Flex');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');
var Container = require('./Container');

function getCmp (arg) {
	return Array.isArray(arg) ? arg[0] : arg;
}

/**
Impose la largeur à tous les enfants
Demande la hauteur aux enfants fixes
Impose la hauteur aux enfants flex
*/
module.exports = compose(function(content) {
	this._container = new Container(content.map(getCmp));
	this._verticalLayouter = new Flex('vertical', content.map(function(arg) {
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
					type: 'fixed',
				};
			}
		} else {
			return {
				cmp: arg,
				type: 'flex',
				weight: 1,
			};
		}
	}));
	var cmpsAsDict = content.reduce(function(acc, arg, index) {
		acc[index] = getCmp(arg);
		return acc;
	}, {});
	this._horizontalLayouter = new Full('horizontal').content(cmpsAsDict);
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
