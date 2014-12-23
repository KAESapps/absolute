var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Marge = require('./layout/Marge');



module.exports = compose(function(content, marge) {
	this._content = content;
	this._horizontalLayouter = new Marge('horizontal', content,
		typeof marge === 'number' ? marge :
			('horizontal' in marge ? marge.horizontal : marge.left),
		typeof marge === 'number' ? marge :
			('horizontal' in marge ? marge.horizontal : marge.right)
	);
	this._verticalLayouter = new Marge('vertical', content,
		typeof marge === 'number' ? marge :
			('vertical' in marge ? marge.vertical : marge.top),
		typeof marge === 'number' ? marge :
			('vertical' in marge ? marge.vertical : marge.bottom)
	);
}, {
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_content', 'depth'),
	parentNode: delegateGetSet('_content', 'parentNode'),
});