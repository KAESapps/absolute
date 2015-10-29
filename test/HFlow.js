var test = require('tape');
var HFlow = require('../HFlow');
var Element = require('../Element');

var Box = function() {
	Element.call(this)
	this.style({
		backgroundColor: 'red',
		border: '2px solid black',
	})
}
Box.prototype = Element.prototype

test('HFlow', function(t) {
	var
		box1 = new Box().height(30),
		box2 = new Box().width(100).height(50),
		box3 = new Box().height(40),
		layouter = new HFlow({ defaults: { width: 200 } }).content([
			box1,
			[{ width: null }, box2],
			box3,
		]).left(0).top(0).zIndex(1).width(300).parentNode(document.body);

	t.equal(layouter.left(), 0);
	t.equal(layouter.top(), 0);
	t.equal(layouter.zIndex(), 1);
	t.equal(layouter.width(), 300);
	t.equal(layouter.height(), 90);
	t.equal(layouter.depth(), 1);
	t.equal(layouter.parentNode(), document.body);

	t.equal(box1.left(), 0);
	t.equal(box1.top(), 0);
	t.equal(box1.zIndex(), 1);
	t.equal(box1.width(), 200);
	t.equal(box1.height(), 30);
	t.equal(box1.depth(), 1);
	t.equal(box1.parentNode(), document.body);

	t.equal(box2.left(), 200);
	t.equal(box2.top(), 0);
	t.equal(box2.zIndex(), 1);
	t.equal(box2.width(), 100);
	t.equal(box2.height(), 50);
	t.equal(box2.depth(), 1);
	t.equal(box2.parentNode(), document.body);

	t.equal(box3.left(), 0);
	t.equal(box3.top(), 50);
	t.equal(box3.zIndex(), 1);
	t.equal(box3.width(), 200);
	t.equal(box3.height(), 40);
	t.equal(box3.depth(), 1);
	t.equal(box3.parentNode(), document.body);

	// resize
	layouter.width(250)

	t.equal(layouter.left(), 0);
	t.equal(layouter.top(), 0);
	t.equal(layouter.zIndex(), 1);
	t.equal(layouter.width(), 250);
	t.equal(layouter.height(), 120);
	t.equal(layouter.depth(), 1);
	t.equal(layouter.parentNode(), document.body);

	t.equal(box1.left(), 0);
	t.equal(box1.top(), 0);
	t.equal(box1.zIndex(), 1);
	t.equal(box1.width(), 200);
	t.equal(box1.height(), 30);
	t.equal(box1.depth(), 1);
	t.equal(box1.parentNode(), document.body);

	t.equal(box2.left(), 0);
	t.equal(box2.top(), 30);
	t.equal(box2.zIndex(), 1);
	t.equal(box2.width(), 100);
	t.equal(box2.height(), 50);
	t.equal(box2.depth(), 1);
	t.equal(box2.parentNode(), document.body);

	t.equal(box3.left(), 0);
	t.equal(box3.top(), 80);
	t.equal(box3.zIndex(), 1);
	t.equal(box3.width(), 200);
	t.equal(box3.height(), 40);
	t.equal(box3.depth(), 1);
	t.equal(box3.parentNode(), document.body);

	t.end();
});
