var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('./_ContentDelegate');

var bindValue = require('ksf/observable/bindValue');

// permet de créer facilement un composant réactif à partir d'un composant non réactif de type 'value'
module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = args.content;
	// binding
	this._own(bindValue(args.value, args.content[args.prop || 'value'].bind(args.content)));
}, {
	content: function() {
		return this._content;
	},
});