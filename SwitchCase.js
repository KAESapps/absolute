var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('./_ContentDelegate');
var Switch = require('./Switch')

var bindValueDestroyable = require('ksf/observable/bindValueDestroyable');

// permet de créer facilement un composant Switch dont le contenu change en fonction d'une valeur observable
module.exports = compose(_Destroyable, _ContentDelegate, function($value, cases) {
	var container = this._content = new Switch({autoHeight: true})
	// binding
	this._own(bindValueDestroyable($value, function (value) {
		var content = cases[value] ? cases[value]() : null
		container.content(content)
		return content
	}))
});
