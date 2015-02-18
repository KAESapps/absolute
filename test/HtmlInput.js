var HtmlInput = require('../HtmlInput');
var Label = require('../TextAreaInput');

var input1 = new HtmlInput().width(500).height(300).left(10).top(10).zIndex(0).parentNode(document.body);
var input2 = new HtmlInput().width(500).height(300).left(10).top(400).zIndex(0).parentNode(document.body);
var output = new Label().width(500).height(300).left(600).top(10).parentNode(document.body);

input1.onInput(function(html) {
	input2.value(html);
	output.value(html);
});



