var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');
var Elmt = require('./Element');
var Container = require('./Container');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');

var easeInQuart = function(t) {
	return t*t*t*t;
};

var PageContainer = compose(function() {
	this._container = new Elmt().style({
		transform: 'translateZ(0)'
	});

	this._hLayout = new Full('horizontal').content([this._container]);
	this._vLayout = new Full('vertical').content([this._container]);
}, {
	content: function(content) {
		if (arguments.length) {
			if (this._content) {
				this._content.parentNode(null);
				this._hLayout.remove('content');
				this._vLayout.remove('content');
				this._content = null;
			}
			if (content) {
				this._content = content.parentNode(this._container.domNode).top(0).left(0).zIndex(0);
				this._hLayout.add('content', content);
				this._vLayout.add('content', content);
			}
		} else {
			return this._content;
		}
		return this;
	},
	parentNode: delegateGetSet('_container', 'parentNode'),
	left: delegateGetSet('_container', 'left'),
	top: delegateGetSet('_container', 'top'),
	zIndex: delegateGetSet('_container', 'zIndex'),
	width: delegateGetSet('_hLayout', 'size'),
	height: delegateGetSet('_vLayout', 'size'),
	depth: delegateGetSet('_container', 'depth'),
	visible: delegateGetSet('_container', 'visible'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
});

module.exports = compose(function() {
	this._props = {};
	this._animInfos = {
		duration: 400,
		startTime: null
	};
	this._currentPageContainer = new PageContainer();
	this._previousPageContainer = new PageContainer();
	this._container = new Container([this._currentPageContainer, this._previousPageContainer]);
	this._hLayout = new Full('horizontal').content([this._currentPageContainer, this._previousPageContainer]);
	this._vLayout = new Full('vertical').content([this._currentPageContainer, this._previousPageContainer]);
	this._zLayout = new ZFlat().content([this._currentPageContainer, this._previousPageContainer]);
}, {
	content: function(content, dir) {
		// set the current page as the previous page and reuse _previousPageContainer for the new page
		var tmp = this._previousPageContainer;
		this._previousPageContainer = this._currentPageContainer;
		this._currentPageContainer = tmp;

		if (content) {
			this._currentPageContainer.content(content);
			this._currentPageContainer.visible(true);
			if (this._previousPageContainer.content()) {
				// animate
				this._animInfos.startTime = Date.now();
				this._animInfos.direction = dir;
				if (!this._animating) {
					this._animating = true;
					window.requestAnimationFrame(this._animate.bind(this));
				}
			} else {
				this._applyLeft();
			}
		}
		return this;
	},
	_animate: function() {
		var t = easeInQuart(Math.min((Date.now() - this._animInfos.startTime) / this._animInfos.duration, 1));
		var delta = t * this.width();

		var dir = this._animInfos.direction === 'right' ? 1 : -1;
		
		this._previousPageContainer.left(this.left() + delta * dir);
		this._currentPageContainer.left(this.left() - (this.width() - delta) * dir);

		if (t < 1) {
			window.requestAnimationFrame(this._animate.bind(this));
		} else {
			this._animating = false;
			this._previousPageContainer.content(null);
			this._previousPageContainer.visible(false);
		}
	},

	left: function(left) {
		if (arguments.length) {
			this._left = left;
			this._applyLeft();
			return this;
		} else {
			return this._left;
		}
	},
	_applyLeft: function() {
		this._previousPageContainer.left(this._left - this.width());
		this._currentPageContainer.left(this._left);
	},
	top: delegateGetSet('_vLayout', 'position'),
	zIndex: delegateGetSet('_zLayout', 'position'),
	width: function(width) {
		if (arguments.length) {
			this._hLayout.size(width);
			this._applyLeft();
			return this;
		} else {
			return this._hLayout.size();
		}
	},
	height: delegateGetSet('_vLayout', 'size'),
	depth: delegateGetSet('_zLayout', 'size'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	visible: delegateGetSet('_container', 'visible'),
	containerVisible: delegateGetSet('_container', 'containerVisible'),
});