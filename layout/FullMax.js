var compose = require('ksf/utils/compose');
var _Evented = require('ksf/base/_Evented');
var onOffEvent = require('../utils/onOffEvent');

var capitalize = require('lodash/string/capitalize')
/**
Layouter qui positionne et dimensionne tous les enfants à la même position et dimension que lui-même
*/
module.exports = compose(_Evented, function(axis) {
	this._children = {};
	this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	this._minSizeProp = (axis === 'vertical' ? 'minHeight' : 'minWidth');
	this._positionProp = (axis === 'vertical' ? 'top' : 'left');
	this._updateSizeBind = this._updateSize.bind(this)
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		// TODO: remove check in build?
		if (key in this._children) {
			throw 'key already used';
		}
		this._children[key] = cmp;
		this._applySize(key);
		this._applyPosition(key);
		this._updateSize();
		cmp['on' + capitalize(this._minSizeProp)](this._updateSizeBind)
	},
	remove: function(key) {
		this._children[key]['off' + capitalize(this._minSizeProp)](this._updateSizeBind)
		delete this._children[key];
		this._updateSize();
	},
	_applySize: function(key) {
		if (this._size !== undefined) {
			this._children[key][this._sizeProp](this._size);
		}
	},
	_applyPosition: function(key) {
		if (typeof this._position === 'number') {
			this._children[key][this._positionProp](this._position);
		}
	},
	// update size from biggest child
	_updateSize: function() {
		this._size = Object.keys(this._children).reduce(function(red, item) {
			return Math.max(red, this._children[item][this._minSizeProp]())
		}.bind(this), 0);

		Object.keys(this._children).forEach(this._applySize, this);
		this._emit('size', this._size)
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			Object.keys(this._children).forEach(this._applyPosition, this);
			return this;
		} else {
			return this._position;
		}
	},
	size: function() {
		return this._size;
	},
}, onOffEvent('size'));
