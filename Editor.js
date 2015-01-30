var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('./_ContentDelegate');

var bindValue = require('ksf/observable/bindValue');

// permet de faire un binding entre un input et une valeur réactive inline dans un déclaratif de layout
module.exports = compose(_Destroyable, _ContentDelegate, function(args) {
	this._content = args.content;
	// binding descendant
	this._own(bindValue(args.value, function(value) {
		if (args.forceUpdate || args.content.value() !== value) { // par défaut on essaie de ne pas faire de modif si le input a déjà la bonne valeur
			args.content.value(value);
		}
	}));
	// binding montant
	this._own(args.content.onInput(function(inputValue) {
		// réinitialisation de la valeur au cas où le change ne déclencherait pas d'événement
		args.pessimistic && args.content.value(args.value.value());
		args.value.change(inputValue);
	}));
});