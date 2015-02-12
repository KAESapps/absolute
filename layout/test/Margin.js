var test = require('tape');
var Margin = require('../Margin');
var Elmt = require('../../Element');

test(function(t) {
	var el = new Elmt();
	new Margin('horizontal', el, 20, 30).size(100).position(0);

	t.equal(el.width(), 50);
	t.equal(el.left(), 20);

	t.end();
});
