var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('../_ContentDelegate');

var bindBranch = require('ksf/observable/deep/bindBranch');

module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = args.content;

	this._own(bindBranch(args.value, {
		add: function(keyAdded) {
			return args.onKeyAdded(keyAdded, args.content);
		},
		remove: function(keyRemoved, storedReturn) {
			args.onKeyRemoved(keyRemoved, args.content, storedReturn);
		},
	}));
});