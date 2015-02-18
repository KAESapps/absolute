var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

var VFlex = require('./VFlex');
var HFlex = require('./HFlex');
var Button = require('./Button');

module.exports = compose(_Destroyable, _ContentDelegate, function() {
	this._content = new VFlex([
		[new HFlex([
			new Button().value('Titre 1').onAction(this._formatBlock.bind(this, 'h1')),
			new Button().value('Titre 2').onAction(this._formatBlock.bind(this, 'h2')),
			new Button().value('Normal').onAction(this._formatBlock.bind(this, 'p')),
			new Button().value('Gras').onAction(this._execCommand.bind(this, 'bold')),
			new Button().value('Italique').onAction(this._execCommand.bind(this, 'italic')),
			new Button().value('Souligné').onAction(this._execCommand.bind(this, 'underline')),
			new Button().value('Liste').onAction(this._execCommand.bind(this, 'insertUnorderedList')),
			new Button().value('Liste numérotée').onAction(this._execCommand.bind(this, 'insertOrderedList')),
		]).height(50), 'fixed'],
		this._own(new Elmt('div').prop('contentEditable', true), 'editable'),
	]);
}, {
	value: function(value) {
		if (arguments.length) {
			this._owned.editable.prop('innerHTML', (typeof value === 'string' ? value : ''));
			return this;
		} else {
			return this._owned.editable.prop('innerHTML');
		}
	},
	onInput: function(cb, key) {
		var self = this;
		this._owned.editable.on('input', function() {
			cb(self.value());
		});
		this._own(cb, key);
		return this;
	},
	offInput: function(key) {
		var cb = this._owned[key];
		this._unown(key);
		this._owned.editable.off('input', cb);
		return this;
	},
	_formatBlock: function(tag) {
		document.execCommand('formatBlock', false, tag);
	},
	_execCommand: function(cmd) {
		document.execCommand(cmd, false, null);
		this._owned.editable.domNode.focus();
	},
});
