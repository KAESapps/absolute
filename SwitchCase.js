var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('./_ContentDelegate');
var Switch = require('./Switch')

var bindValue = require('ksf/observable/bindValue');

// permet de créer facilement un composant Switch dont le contenu change en fonction d'une valeur observable
module.exports = compose(_Destroyable, _ContentDelegate, function($value, cases) {
	var self = this
	var container = this._content = new Switch()
	// binding
	this._own(bindValue($value, function (value) {
		var childScope = [] // TODO: use a frendlyier scope instance
		var content = cases[value] ? cases[value](childScope) : null
		container.content(content)
		self._own(childScope, 'childScope')
	}))
});
