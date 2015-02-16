var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Margin = require('./layout/Margin');
var DomNodeContainer = require('./DomNodeContainer');


/**
Impose la largeur à son enfant mais pas la hauteur
Crée un domNode avec un ascenseur toujours visible
*/
module.exports = compose(function(content, options) {
	options = options || {};
	options.scrollbarDisplay = options.scrollbarDisplay || 'scroll';
	options.scrollBarSize = options.scrollBarSize === undefined ? 15 : options.scrollBarSize;
	
	this._content = content;
	this._container = new DomNodeContainer(content);
	content.left(0).top(0).zIndex(0);
	this._container.style({
		overflowX: 'hidden',
		overflowY: options.scrollbarDisplay,
	});
	this._horizontalLayouter = new Margin('horizontal', content, 0, options.scrollBarSize);
}, {
	width: function(width) {
		if (arguments.length) {
			this._horizontalLayouter.size(width);
			this._container.width(width);
			return this;
		} else {
			return this._container.width();
		}
	},
	height: delegateGetSet('_container', 'height'),
	depth: delegateGetSet('_container', 'depth'),
	left: delegateGetSet('_container', 'left'),
	top: delegateGetSet('_container', 'top'),
	zIndex: delegateGetSet('_container', 'zIndex'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	visible: delegateGetSet('_container', 'visible'),
});
