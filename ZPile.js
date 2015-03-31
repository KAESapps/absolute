var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Full = require('./layout/Full');
var ZPileLayout = require('./layout/ZPile');
var IncrementalContainer = require('./IncrementalContainer');


// empile des composants en 'top' mais leur impose le 'width'
// incrémental
module.exports = compose(function ZPile() {
	this._container = new IncrementalContainer();
	this._verticalLayouter = new Full('vertical');
	this._horizontalLayouter = new Full('horizontal');
	this._zLayouter = new ZPileLayout();
}, {
	content: function(content) {
		this._verticalLayouter.content(content);
		this._horizontalLayouter.content(content);
		this._zLayouter.content(Object.keys(content).map(function(key) {
			return {
				key: key,
				cmp: content[key],
			};
		}));
		this._container.content(content);
		return this;
	},
	add: function(key, cmp, beforeKey) {
		this._verticalLayouter.add(key, cmp);
		this._horizontalLayouter.add(key, cmp);
		this._zLayouter.add(key, cmp, beforeKey);
		this._container.add(key, cmp);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._container.remove(key);
		this._verticalLayouter.remove(key);
		this._horizontalLayouter.remove(key);
		this._zLayouter.remove(key);
		return cmp;
	},
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_zLayouter', 'size'),
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_zLayouter', 'position'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
	visible: delegateGetSet('_container', 'visible'),
});
