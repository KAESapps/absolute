var compose = require('ksf/utils/compose');

function contentGetSet (prop) {
	return function(value) {
		if (arguments.length) {
			this._props[prop] = value;
			this._content && this._content[prop](value);
			return this;
		} else {
			return this._props[prop];
		}
	};
}

var easeOutCirc = function(t) {
	t = t - 1;
	return Math.sqrt(1 - Math.pow(t, 2));
};

module.exports = compose(function() {
	this._props = {};
	this._animInfos = {
		duration: 200,
		startTime: null
	};
}, {
	content: function(content) {
		this._nextContent = content;
		if (content) {
			if (this._content && this._props.parentNode) {
				for (var prop in this._props) {
					if (prop !== 'left') {
						content[prop](this._props[prop]);
					}
				}
				// animate
				this._animInfos.startTime = Date.now();
				window.requestAnimationFrame(this._animate.bind(this));
			} else {
				for (var prop in this._props) {
					content[prop](this._props[prop]);
				}
				this._content = content;
			}
		}
		return this;
	},
	_animate: function() {
		var t = easeOutCirc(Math.min((Date.now() - this._animInfos.startTime) / this._animInfos.duration, 1));
		var delta = t * this._props.width;
		
		this._content.left(this._props.left - delta);
		this._nextContent.left(this._props.left + this._props.width - delta);

		if (t < 1) {
			window.requestAnimationFrame(this._animate.bind(this));
		} else {
			this._content.parentNode(null);
			this._content = this._nextContent;
			this._nextContent = null;
		}
	},
	width: contentGetSet('width'),
	height: contentGetSet('height'),
	depth: contentGetSet('depth'),
	left: contentGetSet('left'),
	top: contentGetSet('top'),
	zIndex: contentGetSet('zIndex'),
	parentNode: contentGetSet('parentNode'),
	visible: contentGetSet('visible'),
});