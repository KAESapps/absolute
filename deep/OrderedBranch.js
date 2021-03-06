var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('../_ContentDelegate');

var bindOrdered = require('ksf/observable/deep/bindOrderedBranch');

module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = args.content;

	var cbs = {
		add: function(keyAdded, beforeKey) {
			return args.onKeyAdded(args.content, keyAdded, beforeKey);
		},
		remove: function(keyRemoved, storedReturn) {
			args.onKeyRemoved(args.content, keyRemoved, storedReturn);
		},
	}
	if (args.onKeyMoved) {
		cbs.move = function(key, beforeKey) {
			args.onKeyMoved(args.content, key, beforeKey);
		}
	}

	this._own(bindOrdered(args.value, cbs));
});
