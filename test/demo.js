var VScroll = require('../VScroll');
var VPile = require('../VPile');
var Label = require('../Label');

var pile = new VPile().left(0).top(0).zIndex(0);

new VScroll(pile, {scrollbarDisplay: 'auto'}).left(0).top(0).zIndex(0).width(100).height(100).parentNode(document.body);

['syv', 'aur', 'ant', 'leo'].forEach(function(key) {
	pile.add(key, new Label().height(40).value(key));
});