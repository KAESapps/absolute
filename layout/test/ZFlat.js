var test = require('tape');
var ZFlat = require('../ZFlat');
var Elmt = require('../../Element');

test('incremental', function(t) {
	var layouter = new ZFlat().position(10);

	var child1 = new Elmt();
	layouter.add(1, child1);
	t.equal(child1.zIndex(), 10);
	t.equal(layouter.size(), 1);

	var child2 = new Elmt();
	layouter.add(2, child2);
	t.equal(child2.zIndex(), 10);
	t.equal(layouter.size(), 1);

	layouter.remove(1);
	layouter.position(100);
	t.equal(child1.zIndex(), 10); // #1 should not change
	t.equal(child2.zIndex(), 100);

	t.end();
});
