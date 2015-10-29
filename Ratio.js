var compose = require('ksf/utils/compose')
var _Evented = require('ksf/base/_Evented')
var delegateGetSet = require('./utils/delegateGetSet');
var getSet = require('./utils/getSet')
var onOffEvent = require('./utils/onOffEvent')

module.exports = compose(_Evented, function(ratioHW, content) {
  this._ratio = ratioHW
  this._content = content
}, {
  _applyWidth: function(width) {
    this._content.width(width)
    this._emit('width', width)
  },
  width: getSet(
    function() {
      return this._content.width()
    },
    function(width) {
      this._applyWidth(width)
      this._applyHeight(width * this._ratio)
    }
  ),
  _applyHeight: function(height) {
    this._content.height(height)
    this._emit('height', height)
  },
  height: getSet(
    function() {
      return this._content.height()
    },
    function(height) {
      this._applyHeight(height)
      this._applyWidth(height / this._ratio)
    }
  ),
  left: delegateGetSet('_content', 'left'),
  top: delegateGetSet('_content', 'top'),
  zIndex: delegateGetSet('_content', 'zIndex'),
  depth: delegateGetSet('_content', 'depth'),
  parentNode: delegateGetSet('_content', 'parentNode'),
  containerVisible: delegateGetSet('_content', 'containerVisible'),
  visible: delegateGetSet('_content', 'visible'),
},
onOffEvent('width'),
onOffEvent('height')
);
