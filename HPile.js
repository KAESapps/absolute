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
	content: function(content) {
		this._horizontalLayouter.content(content.map(function(arg, index) {
			if (Array.isArray(arg)) {
				return {
					cmp: arg[0],
					key: arg[1],
				};
			} else {
				return {
					cmp: arg,
					key: index+'',
				};
			}
		}));
		var cmpsAsDict = content.reduce(function(acc, arg, index) {
			if (Array.isArray(arg)) {
				acc[arg[1]] = arg[0];
			} else {
				acc[index] = arg;
			}
			return acc;
		}, {});
		this._verticalLayouter.content(cmpsAsDict);
		this._zLayouter.content(cmpsAsDict);
		this._container.content(cmpsAsDict);
		return this;
	},
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
	onWidth: function(cb) {
		return this._horizontalLayouter.onSize(cb);
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
