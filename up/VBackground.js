var compose = require('ksf/utils/compose');
var Elmt = require('../Element');
var _ContentDelegate = require('../_ContentDelegate');
var capitalize = require('lodash/string/capitalize');
var compose = require('ksf/utils/compose');

var MasterFull = require('../layout/MasterFull');
var Full = require('../layout/Full');
var ZPile = require('../layout/ZPile');
var LayoutXYZ = require('../LayoutXYZ');


module.exports = compose(_ContentDelegate, function(content) {
	this._content = new LayoutXYZ({
		bg: this._bg = new Elmt(),
		content: content
	}, function(cmps) {
		return new Full('horizontal').content(cmps);
	}, function(cmps) {
		return new MasterFull('vertical', cmps.content).content([cmps.bg]);
	}, function(cmps) {
		return new ZPile().content([{
			key: 'bg',
			cmp: cmps.bg
		}, {
			key: 'content',
			cmp: cmps.content
		}]);
	});
}, {
	color: function(color) {
		this._bg.styleProp('backgroundColor', color);
		return this;
	},
	border: function(border) {
		if (typeof border === 'string') {
			this._bg.styleProp('border', border);
		} else {
			for (var p in border) {
				this._bg.styleProp('border' + capitalize(p), border[p]);
			}
		}
		return this;
	},
	shadow: function(shadow) {
		this._bg.styleProp('boxShadow', shadow);
		return this;
	}
});
