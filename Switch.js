var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _Evented = require('ksf/base/_Evented');
var defaults = require('lodash/object/defaults')
var onOffEvent = require('./utils/onOffEvent')

function contentGetSet (prop) {
	return function(value) {
		if (arguments.length) {
			this._props[prop] = value;
			this._content && this._content[prop](value);
			return this;
		} else {
			return this._props[prop];
		}
	};
}

module.exports = compose(_Destroyable, _Evented, function(opts) {
	this._opts = defaults({}, opts, { autoHeight: false, autoWidth: false })
	this._props = {};
}, {
	content: function(content) {
		if (this._content && this._props.parentNode) {
			this._content.parentNode(null);
			this._destroy('contentHeight')
			this._destroy('contentWidth')
		}
		this._content = content;
		if (content) {
			for (var prop in this._props) {
				this._content[prop](this._props[prop]);
			}
			if (this._opts.autoHeight && this._opts.autoHeight !== 'init') {
				this._own(this._content.onHeight(function(height) {
					this._emit('height', height)
				}.bind(this)), 'contentHeight')
			}
			if (this._opts.autoWidth && this._opts.autoWidth !== 'init') {
				this._own(this._content.onWidth(function(width) {
					this._emit('width', width)
				}.bind(this)), 'contentWidth')
			}
		}
		if (this._opts.autoHeight) {
			this._emit('height', this.height())
		}
		if (this._opts.autoWidth) {
			this._emit('width', this.width())
		}
		return this;
	},
	width: contentGetSet('width'),
	height: function(value) {
		if (arguments.length) {
			this._props.height = value;
			this._content && this._content.height(value);
			return this;
		} else {
			if (this._opts.autoHeight) {
				return this._content ? this._content.height() : 0
			} else {
				return this._props.height;
			}
		}
	},
	depth: contentGetSet('depth'),
	left: contentGetSet('left'),
	top: contentGetSet('top'),
	zIndex: contentGetSet('zIndex'),
	parentNode: contentGetSet('parentNode'),
	visible: contentGetSet('visible'),
	containerVisible: contentGetSet('containerVisible'),
},
	onOffEvent('height'),
	onOffEvent('width')
);
