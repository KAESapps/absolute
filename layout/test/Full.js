var test = require('tape');
var Full = require('../Full');
var Elmt = require('../../Element');

test('incremental', function(t) {
	var layouter = new Full('horizontal').size(100).position(0);

	var child1 = new Elmt();
	layouter.add(1, child1);
	t.equal(child1.left(), 0);
	t.equal(child1.width(), 100);

	var child2 = new Elmt();
	layouter.add(2, child2);
	t.equal(child2.left(), 0);
	t.equal(child2.width(), 100);

	layouter.remove(1);
	layouter.size(50).position(10);
	t.equal(child1.left(), 0); // #1 should not change
	t.equal(child1.width(), 100); // #1 should not change
	t.equal(child2.left(), 10);
	t.equal(child2.width(), 50);

	t.end();
});
