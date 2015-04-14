var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Align = require('./layout/Align');

/**
Aligne un composant horizontalement et étire verticalement
@param content(component)
@param horizontal (left|middle|right)
*/

var horizontalAlign = {
	left: 'head',
	middle: 'middle',
	right: 'tail',
};

module.exports = compose(function(content, horizontal) {
	this._content = content;
	this._horizontalLayouter = new Align('horizontal', content, horizontalAlign[horizontal]);
}, {
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_content', 'top'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_content', 'height'),
	depth: delegateGetSet('_content', 'depth'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
	visible: delegateGetSet('_content', 'visible'),
});