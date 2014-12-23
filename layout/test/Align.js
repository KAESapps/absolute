var test = require('tape');
var Align = require('../Align');
var Elmt = require('../../Element');

test('size', function(t) {
	var el = new Elmt().width(10);
	var align = new Align('horizontal', el, 'head').size(100);

	t.equal(align.size(), 100);

	t.end();
});

test('position', function(t) {
	var el = new Elmt().width(10);
	var align = new Align('horizontal', el, 'head').position(100);

	t.equal(align.position(), 100);

	t.end();
});

test('head position', function (t) {
	var el = new Elmt().width(10);
	new Align('horizontal', el, 'head').size(100).position(0);

	t.equal(el.left(), 0);

	t.end();
});

test('tail position', function (t) {
	var el = new Elmt().width(10);
	new Align('horizontal', el, 'tail').size(100).position(0);

	t.equal(el.left(), 90);

	t.end();
});

test('middle position', function (t) {
	var el = new Elmt().width(10);
	new Align('horizontal', el, 'middle').size(100).position(0);

	t.equal(el.left(), 45);

	t.end();
});