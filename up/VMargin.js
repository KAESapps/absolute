var compose = require('ksf/utils/compose');
var delegateGetSet = require('../utils/delegateGetSet');

var UpMargin = require('../layout/UpMargin');
var Margin = require('../layout/Margin');



module.exports = compose(function(content, margin) {
	this._content = content;
	this._horizontalLayouter = new Margin('horizontal', content,
		typeof margin === 'number' ? margin :
			('horizontal' in margin ? margin.horizontal : margin.left),
		typeof margin === 'number' ? margin :
			('horizontal' in margin ? margin.horizontal : margin.right)
	);
	this._verticalLayouter = new UpMargin('vertical', content,
		typeof margin === 'number' ? margin :
			('vertical' in margin ? margin.vertical : margin.top),
		typeof margin === 'number' ? margin :
			('vertical' in margin ? margin.vertical : margin.bottom)
	);
}, {
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	onHeight: function(cb) {
		return this._verticalLayouter.onSize(cb);
	},
	depth: delegateGetSet('_content', 'depth'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	containerVisible: delegateGetSet('_content', 'containerVisible'),
});