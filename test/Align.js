var test = require('tape');
var Align = require('../Align');
var Elmt = require('../Element');

test('align api', function(t) {
	var el = new Elmt().width(10).height(10);
	var align = new Align(el, 'middle', 'middle')
		.width(100)
		.height(100)
		.left(0)
		.top(0)
		.zIndex(10)
		.parentNode(document.body)
	;

	t.equal(align.left(), 0);
	t.equal(align.top(), 0);
	t.equal(align.zIndex(), 10);
	t.equal(align.width(), 100);
	t.equal(align.height(), 100);
	t.equal(align.depth(), 1);
	t.equal(align.parentNode(), document.body);

	t.end();
});

test('middle middle', function(t) {
	var el = new Elmt().width(10).height(10);
	new Align(el, 'middle', 'middle')
		.width(100)
		.height(100)
		.left(0)
		.top(0)
		.zIndex(10)
		.parentNode(document.body)
	;

	t.equal(el.left(), 45);
	t.equal(el.top(), 45);
	t.equal(el.zIndex(), 10);
	t.equal(el.width(), 10);
	t.equal(el.height(), 10);
	t.equal(el.depth(), 1);
	t.equal(el.parentNode(), document.body);

	t.end();
});

test('right top', function(t) {
	var el = new Elmt().width(10).height(10);
	new Align(el, 'right', 'top')
		.width(100)
		.height(100)
		.left(0)
		.top(0)
		.zIndex(10)
		.parentNode(document.body)
	;

	t.equal(el.left(), 90);
	t.equal(el.top(), 0);
	t.equal(el.zIndex(), 10);
	t.equal(el.width(), 10);
	t.equal(el.height(), 10);
	t.equal(el.depth(), 1);
	t.equal(el.parentNode(), document.body);

	t.end();
});
