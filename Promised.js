var compose = require('ksf/utils/compose');
var _ContentDelegate = require('./_ContentDelegate');

var consoleWarn = (err) => console.warn('Promised warning', err)

// permet de créer facilement un composant réactif une fois pour une propriété à partir d'un composant non réactif
// pas besoin d'être _Destroyable car on ne peut pas se désabonner d'un promise
module.exports = compose(_ContentDelegate, function(args) {
	this._content = args.content;
	// binding
	args.value.then(
		args.content[args.prop || 'value'].bind(args.content),
		consoleWarn // je ne sais pas si on pourrait faire autre chose (envoyer null ?)
	)
});
