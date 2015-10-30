var compose = require('ksf/utils/compose')
var _Evented = require('ksf/base/_Evented')
var delegateGetSet = require('./utils/delegateGetSet')
var delegateGet = require('./utils/delegateGet')
var VPile = require('./VPile')
var HPile = require('./HPile')

module.exports = compose(_Evented, function(args) {
  this._args = args
  this._rowContainer = new VPile()
}, {
  content: function(content) {
    this._content = content
    this._layout()
    return this
  },
  _layout: function() {
    var width = this.width()

    if (width === undefined || !this._content) { return }

    // compute nb of columns & rows
    var nbCols = Math.floor(width / this._args.minWidth) || 1
    var nbRows = Math.ceil(this._content.length / nbCols)

    // compute sizes
    var colWidth = width / nbCols

    var rowHeight = colWidth / this._args.ratioWH


    // split items into rows
    this._rows = []
    for (var i = 0; i < nbRows; i++) {
      var rowItems = []
      for (var j = 0; j < nbCols && (i * nbCols + j) < this._content.length; j++) {
        rowItems.push(this._content[i * nbCols + j].width(colWidth))
      }
      this._rows.push(new HPile().content(rowItems).height(rowHeight))
    }
    this._rowContainer.content(this._rows)

    this._emit('height')
  },
  width: function(width) {
    if (arguments.length) {
      this._rowContainer.width(width)
      this._layout()
      return this
    } else {
      return this._rowContainer.width()
    }
  },
  onHeight: function(cb) {
    return this._on('height', cb)
  },
	height: delegateGet('_rowContainer', 'height'),
	depth: delegateGetSet('_rowContainer', 'depth'),
	left: delegateGetSet('_rowContainer', 'left'),
	top: delegateGetSet('_rowContainer', 'top'),
	zIndex: delegateGetSet('_rowContainer', 'zIndex'),
	parentNode: delegateGetSet('_rowContainer', 'parentNode'),
	containerVisible: delegateGetSet('_rowContainer', 'containerVisible'),
	visible: delegateGetSet('_rowContainer', 'visible'),
})
