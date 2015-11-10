var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');
var delegateGet = require('./utils/delegateGet');

var Align = require('./layout/Align');

/**
Aligne un composant verticalement et étire horizontalement
@param content(component)
@param horizontal (left|middle|right)
*/

var verticalAlign = {
	top: 'head',
	middle: 'middle',
	bottom: 'tail',
};

module.exports = compose(function(content, vertical) {
	this._content = content;
	this._verticalLayouter = new Align('vertical', content, verticalAlign[vertical]);
}, {
	top: delegateGetSet('_verticalLayouter', 'position'),
	left: delegateGetSet('_content', 'left'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	width: delegateGetSet('_content', 'width'),
	depth: delegateGetSet('_content', 'depth'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
	visible: delegateGetSet('_content', 'visible'),
	minHeight: delegateGet('_content', 'height'),
	onMinHeight: function(cb) {
		this._content.onHeight(cb)
	},
});
