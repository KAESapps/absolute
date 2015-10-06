var test = require('tape');
var VFlex = require('../VFlex');
var Elmt = require('../Element');

test('VFlex', function(t) {
	var child1 = new Elmt();
	var child2 = new Elmt().height(20);
	var child3 = new Elmt();
	var child4 = new Elmt().height(0);

	var nbHeightChangesProcessed = 0
	// mock onHeight
	child4.onHeight = function(cb) {
		this.heightChanged = function() {
			cb()
			nbHeightChangesProcessed++
		}
	}
	child4.offHeight = function(cb) {
		this.heightChanged = function() {}
	}

	var layouter = new VFlex([
		child1,
		[child2, 'fixed'],
		[child3, 2],
		[child4, 'reactive'],
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

	t.equal(child4.left(), 0);
	t.equal(child4.top(), 100);
	t.equal(child4.zIndex(), 1);
	t.equal(child4.width(), 100);
	t.equal(child4.height(), 0);
	t.equal(child4.depth(), 1);
	t.equal(child4.parentNode(), document.body);

	// change child4's height
	child4.height(20)
	child4.heightChanged()

	t.equal(nbHeightChangesProcessed, 1)

	// no change on layouter's properties
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
	// child1 is 1/3 of 60px (= 100px - 20px (child1) - 20px (child4))
	t.equal(child1.height(), 20);
	t.equal(child1.depth(), 1);
	t.equal(child1.parentNode(), document.body);

	t.equal(child2.left(), 0);
	t.equal(child2.top(), 20);
	t.equal(child2.zIndex(), 1);
	t.equal(child2.width(), 100);
	t.equal(child2.height(), 20);
	t.equal(child2.depth(), 1);
	t.equal(child2.parentNode(), document.body);

	t.equal(child3.left(), 0);
	t.equal(child3.top(), 40);
	t.equal(child3.zIndex(), 1);
	t.equal(child3.width(), 100);
	t.equal(child3.height(), 40);
	t.equal(child3.depth(), 1);
	t.equal(child3.parentNode(), document.body);

	t.equal(child4.left(), 0);
	t.equal(child4.top(), 80);
	t.equal(child4.zIndex(), 1);
	t.equal(child4.width(), 100);
	t.equal(child4.height(), 20);
	t.equal(child4.depth(), 1);
	t.equal(child4.parentNode(), document.body);

	// destroy layouter
	layouter.destroy()

	// change child4's height once again
	child4.height(30)
	child4.heightChanged()
	// child4's last height change should not have been processed by layouter
	t.equal(nbHeightChangesProcessed, 1)


	t.end();
});
