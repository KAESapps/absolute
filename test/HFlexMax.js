var HFlex = require('../HFlex');
var VPile = require('../VPile');
var Align = require('../Align');
var Label = require('../Label');
var Switch = require('../Switch');

var pileContent1 = new VPile().content([
	new Label().value("content1").height(30),
])

var pileContent2 = window.pile2 = new VPile().content([
	new Label().value("content2").height(20),
])
var pileContent3 = window.pile3 = new VPile().content([
	new Label().value("above footer").height(20),
])

var sw = window.sw = new Switch({ autoHeight: true })

new VPile().content([
	new HFlex([
		new Align(pileContent1.width(100), 'middle', 'middle'),
		new Align(pileContent2.width(100), 'middle', 'middle'),
	], { autoHeight: true }),
	sw,
	new Label().value("Footer").height(20),
]).left(0).top(0).zIndex(0).width(200).parentNode(document.body);

pileContent1.add('row2', new Label().value("content1 row2").height(20));
pileContent2.add('row2', new Label().value("content1 row2").height(80));
pileContent3.add('row2', new Label().value("above footer row2").height(80));
sw.content(pileContent3)
