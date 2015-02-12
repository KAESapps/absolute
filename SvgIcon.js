var compose = require('ksf/utils/compose');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_ContentDelegate, function(pathInfo) {
	this._content = new Elmt('svg', "http://www.w3.org/2000/svg").attrs({
		preserveAspectRatio: 'xMinYMid meet',
		viewBox: "0 0 " + pathInfo.width + " " + pathInfo.height
	});
	this._pathNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
	this._pathNode.setAttribute('d', pathInfo.data);
	this._content.domNode.appendChild(this._pathNode);
}, {
	color: function(color) {
		this._pathNode.style.fill = color;
		return this;
	},
});
