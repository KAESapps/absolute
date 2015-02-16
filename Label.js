var compose = require('ksf/utils/compose');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_ContentDelegate, function() {
	this._content = new Elmt().style({
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	});
	this._vAlign = 'middle';
}, {
	value: function(value) {
		this._content.prop('textContent', (typeof value === 'string' ? value : ''));
		return this;
	},
	hAlign: function(hAlign) {
		this._content.styleProp('textAlign', hAlign);
		return this;
	},
	vAlign: function(vAlign) {
		this._vAlign = vAlign;
		this._applyVAlign();
		return this;
	},
	_applyVAlign: function() {
		this._content.styleProp('lineHeight', null);
		this._content.styleProp('padding-top', null);
		if (this._vAlign === 'bottom') {
			this._content.styleProp('padding-top', 'calc(' + this._content.height() + 'px - 1em)');
		} else if (this._vAlign === 'middle') {
			this._content.styleProp('lineHeight', this._content.height() + 'px');
		}
	},
	height: function(height) {
		if (arguments.length) {
			this._content.height(height);
			this._applyVAlign();
			return this;
		} else {
			return this._content.height();
		}
	},
	color: function(color) {
		this._content.styleProp('color', color);
		return this;
	},
	font: function(font) {
		if (typeof font === 'string') {
			this._content.styleProp('font', font);
		} else {
			this._content.style({
				fontFamily: font.family,
				fontWeight: font.weight,
				fontSize: font.size
			});
		}
		return this;
	}
});
