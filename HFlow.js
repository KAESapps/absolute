var compose = require('ksf/utils/compose')
var _Evented = require('ksf/base/_Evented')
var delegateGetSet = require('./utils/delegateGetSet')
var delegateGet = require('./utils/delegateGet')
var VPile = require('./VPile')
var HPile = require('./HPile')
var VAlign = require('./VAlign')
var defaults = require('lodash/object/defaults')
var defaultsDeep = require('lodash/object/defaultsDeep')

function normalizeContentArg(contentArg, defaultArgs) {
  return contentArg.map(function(itemArg) {
		if (Array.isArray(itemArg)) {
      return defaults({
        cmp: itemArg[1],
      }, itemArg[0], defaultArgs)
		} else {
			return defaults({
				cmp: itemArg,
			}, defaultArgs)
		}
	})
}

module.exports = compose(_Evented, function(args) {
  // normalize args
  this._args = defaultsDeep({}, args, {
    defaults: {
      width: null,
    },
  })

  this._rowContainer = new VPile()
}, {
  content: function(content) {
    this._content = normalizeContentArg(content, this._args.defaults)
    this._layout()
    return this
  },
  _layout: function() {
    var width = this.width()

    if (width === undefined || !this._content) { return }

    // clear rows
    this._rows && this._rows.forEach(function(row, index) {
      this._rowContainer.remove(index)
    }.bind(this))
    // split items into rows
    this._rows = []
    var
      currentRow = [],
      rowWidth = 0
    this._rows.push(currentRow)

    this._content.forEach(function(itemArg) {
      // get item width
      var itemWidth = (itemArg.width === null && itemArg.cmp.width()) || itemArg.width

      if (rowWidth + itemWidth > width) {
        this._rows.push(currentRow = [])
        rowWidth = 0
      }

      currentRow.push(itemArg.cmp.width(itemWidth))
      rowWidth += itemWidth
    }.bind(this))

    this._rows.forEach(function(row, index) {
      // process max height
      var rowHeight = row.reduce(function(maxHeight, item) {
        return Math.max(item.height(), maxHeight)
      }, 0)

      // fill row with items
      this._rowContainer.add(index, new HPile().height(rowHeight).content(row.map(function(item) {
        return new VAlign(item, 'top')
      })))
    }.bind(this))

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
