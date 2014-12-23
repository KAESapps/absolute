var test = require('tape');
var VPile = require('../VPile');
var Elmt = require('../Element');

test('VPile', function(t) {
	var layouter = new VPile().left(0).top(0).zIndex(1).width(100).parentNode(document.body);

	var child1 = new Elmt().height(10);
	layouter.add(1, child1);
	t.equal(layouter.left(), 0);
	t.equal(layouter.top(), 0);
	t.equal(layouter.zIndex(), 1);
	t.equal(layouter.width(), 100);
	t.equal(layouter.height(), 10);
	t.equal(layouter.depth(), 1);
	t.equal(layouter.parentNode(), document.body);
	t.equal(child1.left(), 0);
	t.equal(child1.top(), 0);
	t.equal(child1.zIndex(), 1);
	t.equal(child1.width(), 100);
	t.equal(child1.height(), 10);
	t.equal(child1.depth(), 1);
	t.equal(child1.parentNode(), document.body);

	var child2 = new Elmt().height(20);
	layouter.add(2, child2);
	t.equal(layouter.left(), 0);
	t.equal(layouter.top(), 0);
	t.equal(layouter.zIndex(), 1);
	t.equal(layouter.width(), 100);
	t.equal(layouter.height(), 30);
	t.equal(layouter.depth(), 1);
	t.equal(layouter.parentNode(), document.body);
	t.equal(child2.left(), 0);
	t.equal(child2.top(), 10);
	t.equal(child2.zIndex(), 1);
	t.equal(child2.width(), 100);
	t.equal(child2.height(), 20);
	t.equal(child2.depth(), 1);
	t.equal(child2.parentNode(), document.body);

	layouter.remove(1);
	layouter.left(10).top(10).zIndex(10).width(200).parentNode(null);
	t.equal(layouter.left(), 10);
	t.equal(layouter.top(), 10);
	t.equal(layouter.zIndex(), 10);
	t.equal(layouter.width(), 200);
	t.equal(layouter.height(), 20);
	t.equal(layouter.depth(), 1);
	t.equal(layouter.parentNode(), null);
	// child1 should not change
	t.equal(child1.left(), 0);
	t.equal(child1.top(), 0);
	t.equal(child1.zIndex(), 1);
	t.equal(child1.width(), 100);
	t.equal(child1.height(), 10);
	t.equal(child1.depth(), 1);
	t.equal(child1.parentNode(), null);
	// child2 should change
	t.equal(child2.left(), 10);
	t.equal(child2.top(), 10);
	t.equal(child2.zIndex(), 10);
	t.equal(child2.width(), 200);
	t.equal(child2.height(), 20);
	t.equal(child2.depth(), 1);
	t.equal(child2.parentNode(), null);

	t.end();
});
