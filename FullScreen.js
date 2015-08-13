function sizePage (cmp) {
	cmp.width(window.innerWidth);
	cmp.height(window.innerHeight);
}

var compose = require('ksf/utils/compose');
var _Destroyable = require('ksf/base/_Destroyable');
var _ContentDelegate = require('./_ContentDelegate');


// pilote un composant pour le mettre en plein écran et réagir au redimensionnement
module.exports = compose(_Destroyable, _ContentDelegate, function(content) {
	var currentWidth, currentHeight
	// init
	content
		.left(0)
		.top(0)
		.zIndex(0)
		.width(currentWidth = window.innerWidth)
		.height(currentHeight = window.innerHeight)
		.parentNode(document.body)
		.containerVisible(true)
	// update
	// TODO: limit execution rate at 60fps ?
	var resizeCb = function () {
		var newWidth = window.innerWidth
		var newHeight = window.innerHeight
		if (newWidth !== currentWidth) {
			content.width(currentWidth = newWidth)
		}
		if (newHeight !== currentHeight) {
			content.height(currentHeight = newHeight)
		}
	}
	window.addEventListener('resize', resizeCb)
	this._own(function () {
		window.removeEventListener('resize', resizeCb)
	})
});
