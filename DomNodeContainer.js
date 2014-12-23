var compose = require('ksf/utils/compose');
var Elmt = require('./Element');

/**
Permet de placer un composant dans un domNode enfant plutôt que dans le parentNode directement (crée un nouveau contexte)
*/
module.exports = compose(Elmt.prototype,  function(content) {
	Elmt.call(this, 'div');
	content.parentNode(this._domNode);
});