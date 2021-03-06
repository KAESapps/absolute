var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');
var delegateGet = require('./utils/delegateGet');

var Align = require('./layout/Align');

/**
Aligne un composant horizontalement et verticalement
@param content(component)
@param horizontal (left|middle|right)
@param vertical (top|middle|bottom)
*/

var horizontalAlign = {
	left: 'head',
	middle: 'middle',
	right: 'tail',
};
var verticalAlign = {
	top: 'head',
	middle: 'middle',
	bottom: 'tail',
};

module.exports = compose(function(content, horizontal, vertical) {
	this._content = content;
	this._horizontalLayouter = new Align('horizontal', content, horizontalAlign[horizontal]);
	this._verticalLayouter = new Align('vertical', content, verticalAlign[vertical]);
}, {
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_content', 'depth'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
	visible: delegateGetSet('_content', 'visible'),
	minHeight: delegateGet('_content', 'height'),
	onMinHeight: function(cb) {
		this._content.onHeight(cb)
	},
});
