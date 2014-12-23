var test = require('tape');
var Marge = require('../Marge');
var Elmt = require('../../Element');

test(function(t) {
	var el = new Elmt();
	new Marge('horizontal', el, 20, 30).size(100).position(0);

	t.equal(el.width(), 50);
	t.equal(el.left(), 20);

	t.end();
});
