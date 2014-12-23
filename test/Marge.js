var test = require('tape');
var Marge = require('../Marge');
var Elmt = require('../Element');

test('container api', function(t) {
	var el = new Elmt();
	var container = new Marge(el, 10)
		.width(100)
		.height(100)
		.left(0)
		.top(0)
		.zIndex(10)
		.parentNode(document.body)
	;

	t.equal(container.left(), 0);
	t.equal(container.top(), 0);
	t.equal(container.zIndex(), 10);
	t.equal(container.width(), 100);
	t.equal(container.height(), 100);
	t.equal(container.depth(), 1);
	t.equal(container.parentNode(), document.body);

	t.end();
});

test('same marge for all sides', function(t) {
	var el = new Elmt();
	new Marge(el, 10)
		.width(100)
		.height(100)
		.left(0)
		.top(0)
		.zIndex(10)
		.parentNode(document.body)
	;

	t.equal(el.left(), 10);
	t.equal(el.top(), 10);
	t.equal(el.zIndex(), 10);
	t.equal(el.width(), 80);
	t.equal(el.height(), 80);
	t.equal(el.depth(), 1);
	t.equal(el.parentNode(), document.body);

	t.end();
});

test('horizontal and vertical marges', function(t) {
	var el = new Elmt();
	new Marge(el, {
		horizontal: 20,
		vertical: 30,
	})
		.width(100)
		.height(100)
		.left(0)
		.top(0)
		.zIndex(10)
		.parentNode(document.body)
	;

	t.equal(el.left(), 20);
	t.equal(el.top(), 30);
	t.equal(el.zIndex(), 10);
	t.equal(el.width(), 60);
	t.equal(el.height(), 40);
	t.equal(el.depth(), 1);
	t.equal(el.parentNode(), document.body);

	t.end();
});

test('different marges for horizontal sides', function(t) {
	var el = new Elmt();
	new Marge(el, {
		left: 20,
		right: 10,
		vertical: 30,
	})
		.width(100)
		.height(100)
		.left(0)
		.top(0)
		.zIndex(10)
		.parentNode(document.body)
	;

	t.equal(el.left(), 20);
	t.equal(el.top(), 30);
	t.equal(el.zIndex(), 10);
	t.equal(el.width(), 70);
	t.equal(el.height(), 40);
	t.equal(el.depth(), 1);
	t.equal(el.parentNode(), document.body);

	t.end();
});
