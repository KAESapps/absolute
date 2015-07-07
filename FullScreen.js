function sizePage (cmp) {
	cmp.width(window.innerWidth);
	cmp.height(window.innerHeight);
}

var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('./_ContentDelegate');


// pilote un composant pour le mettre en plein écran et réagir au redimensionnement
module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	sizePage(content);
	content.left(0).top(0).zIndex(0).parentNode(document.body);
	window.addEventListener('resize', sizePage.bind(null, content));
});


