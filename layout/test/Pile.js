var test = require('tape');
var Pile = require('../Pile');
var Elmt = require('../../Element');

test('content', function(t) {
	var pile = new Pile('horizontal').position(0).content([
		{key: 1, cmp: new Elmt().width(10)},
		{key: 2, cmp: new Elmt().width(20)},
		{key: 3, cmp: new Elmt().width(30)},
	]);

	t.equal(pile.size(), 60);
	t.equal(pile.children()[1].cmp.left(), 0);
	t.equal(pile.children()[2].cmp.left(), 10);
	t.equal(pile.children()[3].cmp.left(), 30);

	t.end();
});

test('incremental', function(t) {
	var pile = new Pile('horizontal').position(0);

	pile.add(1, new Elmt().width(10));
	t.equal(pile.size(), 10);
	t.equal(pile.children()[1].cmp.left(), 0);

	pile.add(3, new Elmt().width(30));
	t.equal(pile.size(), 40);
	t.equal(pile.children()[1].cmp.left(), 0);
	t.equal(pile.children()[3].cmp.left(), 10);

	pile.add(2, new Elmt().width(20), 3);
	t.equal(pile.size(), 60);
	t.equal(pile.children()[1].cmp.left(), 0);
	t.equal(pile.children()[2].cmp.left(), 10);
	t.equal(pile.children()[3].cmp.left(), 30);

	pile.remove(1);
	t.equal(pile.size(), 50);
	t.equal(pile.children()[2].cmp.left(), 0);
	t.equal(pile.children()[3].cmp.left(), 20);

	t.end();
});
