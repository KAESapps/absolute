var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Pile = require('./layout/Pile');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');
var IncrementalContainer = require('./IncrementalContainer');


// empile des composants de largeur propre en 'left' mais leur impose le 'height'
// incrémental
module.exports = compose(function() {
	this._container = new IncrementalContainer();
	this._verticalLayouter = new Full('vertical');
	this._horizontalLayouter = new Pile('horizontal');
	this._zLayouter = new ZFlat();
}, {
	add: function(key, cmp, beforeKey) {
		this._verticalLayouter.add(key, cmp, beforeKey);
		this._horizontalLayouter.add(key, cmp);
		this._zLayouter.add(key, cmp);
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
	visible: delegateGetSet('_container', 'visible'),
});
