var test = require('tape');
var Flex = require('../Flex');
var Elmt = require('../../Element');

test('flex', function(t) {
	var fixedChild1 = new Elmt().height(10);
	var fixedChild2 = new Elmt().height(20);
	var flexChild1 = new Elmt();
	var flexChild2 = new Elmt();

	var container = new Flex('vertical', [
		{cmp: fixedChild1, type: 'fixed'},
		{cmp: flexChild1, type: 'flex', weight: 1},
		{cmp: fixedChild2, type: 'fixed'},
		{cmp: flexChild2, type: 'flex', weight: 2},
	]).position(0).size(100);

	t.equal(container.size(), 100);
	t.equal(container.position(), 0);

	t.equal(fixedChild1.top(), 0);
	t.equal(fixedChild1.height(), 10);
	t.equal(flexChild1.top(), 10);
	t.equal(flexChild1.height(), 24); // c'est le premier enfant qui gagne le pixel d'arrondi
	t.equal(fixedChild2.top(), 34);
	t.equal(fixedChild2.height(), 20);
	t.equal(flexChild2.top(), 54);
	t.equal(flexChild2.height(), 46);

	t.end();
});
