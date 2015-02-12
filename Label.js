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
	top: function(top) {
		if (arguments.length) {
			this._top = top;
			this._applyVAlign();
			return this;
		} else {
			return this._top;
		}
	},
	_applyVAlign: function() {
		this._content.styleProp('bottom', null);
		this._content.styleProp('top', null);
		this._content.styleProp('lineHeight', null);
		if (this._vAlign === 'top') {
			this._content.top(this._top);
		} else if (this._vAlign === 'bottom') {
			this._content.styleProp('bottom', this._top + this._content.height() + 'px');
		} else if (this._vAlign === 'middle') {
			this._content.styleProp('lineHeight', this._content.height() + 'px');
			this._content.top(this._top);
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
});
