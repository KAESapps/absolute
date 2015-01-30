var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('../_ContentDelegate');

var bindBranch = require('ksf/observable/deep/bindBranch');

module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	var storage = {}; // allow to store things by key (mainly for canceling observations)
	this._content = args.content;

	this._own(bindBranch(args.value, {
		add: function(keyAdded) {
			var ret = args.onKeyAdded(keyAdded, args.content);
			if (ret) {
				storage[keyAdded] = ret;
			}
		},
		remove: function(keyRemoved) {
			args.onKeyRemoved(keyRemoved, args.content, storage[keyRemoved]);
		},
	}));
});