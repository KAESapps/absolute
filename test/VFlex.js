var test = require('tape');
var VFlex = require('../VFlex');
var Elmt = require('../Element');

test('VFlex', function(t) {
	var child1 = new Elmt();
	var child2 = new Elmt().height(20);
	var child3 = new Elmt();
	var layouter = new VFlex([
		child1,
		[child2, 'fixed'],
		[child3, 2],
	]).left(0).top(0).zIndex(1).width(100).height(100).parentNode(document.body);

	t.equal(layouter.left(), 0);
	t.equal(layouter.top(), 0);
	t.equal(layouter.zIndex(), 1);
	t.equal(layouter.width(), 100);
	t.equal(layouter.height(), 100);
	t.equal(layouter.depth(), 1);
	t.equal(layouter.parentNode(), document.body);

	t.equal(child1.left(), 0);
	t.equal(child1.top(), 0);
	t.equal(child1.zIndex(), 1);
	t.equal(child1.width(), 100);
	t.equal(child1.height(), 27);
	t.equal(child1.depth(), 1);
	t.equal(child1.parentNode(), document.body);

	t.equal(child2.left(), 0);
	t.equal(child2.top(), 27);
	t.equal(child2.zIndex(), 1);
	t.equal(child2.width(), 100);
	t.equal(child2.height(), 20);
	t.equal(child2.depth(), 1);
	t.equal(child2.parentNode(), document.body);

	t.equal(child3.left(), 0);
	t.equal(child3.top(), 47);
	t.equal(child3.zIndex(), 1);
	t.equal(child3.width(), 100);
	t.equal(child3.height(), 53);
	t.equal(child3.depth(), 1);
	t.equal(child3.parentNode(), document.body);

	t.end();
});
