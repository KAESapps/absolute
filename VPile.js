var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Pile = require('./layout/Pile');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');
var IncrementalContainer = require('./IncrementalContainer');


// empile des composants en 'top' mais leur impose le 'width'
// incrémental
module.exports = compose(function() {
	this._container = new IncrementalContainer();
	this._verticalLayouter = new Pile('vertical');
	this._horizontalLayouter = new Full('horizontal');
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

	// est-ce bien utile ?
/*	content: function(content) {
			// remove current children
			var children = this._verticalLayout.children();
			Object.keys(children).forEach(function(key) {
				this.remove(key);
			}, this);
			// add new children
			content.forEach(function(cmp, i) {
				this.add(i+'', cmp, null);
			}, this);
			return this;
		},
	at: function(key) {
		return this._container.children()[key].cmp;
	},
*/});
