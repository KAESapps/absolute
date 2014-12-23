(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/media/sylvain/data/projects/absolute/DomNodeContainer.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var Elmt = require('./Element');

/**
Permet de placer un composant dans un domNode enfant plutôt que dans le parentNode directement (crée un nouveau contexte)
*/
module.exports = compose(Elmt.prototype,  function(content) {
	Elmt.call(this, 'div');
	content.parentNode(this._domNode);
});
},{"./Element":"/media/sylvain/data/projects/absolute/Element.js","ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/Element.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');

module.exports = compose(function(tag) {
	var node = this._domNode = document.createElement(tag || 'div');
	node.style.position = 'absolute';
	node.style.boxSizing = 'border-box';
	node.style.display = 'block'; // est-ce nécessaire de le forcer au démarrage ?
	this._visible = true;
}, {
	left: function(left) {
		if (arguments.length) {
			this._left = left;
			this._domNode.style.left = left+'px';
			return this;
		} else {
			return this._left;
		}
	},
	top: function(top) {
		if (arguments.length) {
			this._top = top;
			this._domNode.style.top = top+'px';
			return this;
		} else {
			return this._top;
		}
	},
	zIndex: function(zIndex) {
		if (arguments.length) {
			this._zIndex = zIndex;
			this._domNode.style.zIndex = zIndex;
			return this;
		} else {
			return this._zIndex;
		}
	},
	width: function(width) {
		if (arguments.length) {
			this._width = width;
			this._domNode.style.width = width+'px';
			return this;
		} else {
			return this._width;
		}
	},
	height: function(height) {
		if (arguments.length) {
			this._height = height;
			this._domNode.style.height = height+'px';
			return this;
		} else {
			return this._height;
		}
	},
	depth: function() {
		return 1;
	},
	parentNode: function(parentNode) {
		if (arguments.length) {
			if (parentNode) {
				parentNode.appendChild(this._domNode);
			} else {
				this._parentNode && this._parentNode.removeChild(this._domNode);
			}
			this._parentNode = parentNode;
			return this;
		} else {
			return this._parentNode;
		}
	},
	visible: function(visible) {
		if (arguments.length) {
			this._visible = visible;
			this._domNode.style.display = (visible ? 'block' : 'none');
			return this;
		} else {
			return this._visible;
		}
	},
}, {
	prop: function(prop, value) {
		this._domNode[prop] = value;
		return this;
	},
	props: function(props) {
		Object.keys(props).forEach(function(prop) {
			this.prop(prop, props[prop]);
		}, this);
	},
	styleProp: function(prop, value) {
		this._domNode.style[prop] = value;
	},
	style: function(style) {
		Object.keys(style).forEach(function(prop) {
			this.styleProp(prop, style[prop]);
		}, this);
	},
});

},{"ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/IncrementalContainer.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');


module.exports = compose(function() {
	this._children = {};
}, {
	add: function(key, cmp) {
		this._children[key] = cmp;
		this._insertInParentNode(key);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._children[key];
		this._removeFromParentNode(key);
		delete this._children[key];
		return cmp;
	},
	parentNode: function(node) {
		if (arguments.length) {
			this._parentNode = node;
			Object.keys(this._children).forEach(this._insertInParentNode, this);
			return this;
		} else {
			return this._parentNode;
		}
	},
	visible: function(visible) {
		if (arguments.length) {
			this._visible = visible;
			Object.keys(this._children).forEach(this._applyVisible, this);
			return this;
		} else {
			return this._visible;
		}
	},
	_insertInParentNode: function(key) {
		var cmp = this._children[key];
		cmp.parentNode(this._parentNode);
	},
	_removeFromParentNode: function(key) {
		var cmp = this._children[key];
		cmp.parentNode(null);
	},
	_applyVisible: function(key) {
		var cmp = this._children[key];
		cmp.visible(this._visible);
	},
});
},{"ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/Label.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var Elmt = require('./Element');
var _ContentDelegate = require('./_ContentDelegate');

module.exports = compose(_ContentDelegate, function() {
	this._content = new Elmt();
}, {
	value: function(value) {
		this._content.prop('textContent', (typeof value === 'string' ? value : ''));
		return this;
	},
});

},{"./Element":"/media/sylvain/data/projects/absolute/Element.js","./_ContentDelegate":"/media/sylvain/data/projects/absolute/_ContentDelegate.js","ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/VPile.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Pile = require('./layout/Pile');
var Full = require('./layout/Full');
var ZFlat = require('./layout/ZFlat');
var IncrementalContainer = require('./IncrementalContainer');


// empile des composants en 'top' mais leur impose le 'width'
// incrémental
module.exports = compose(function() {
	this._container = new IncrementalContainer();
	this._verticalLayouter = new Pile('vertical');
	this._horizontalLayouter = new Full('horizontal');
	this._zLayouter = new ZFlat();
}, {
	add: function(key, cmp, beforeKey) {
		this._verticalLayouter.add(key, cmp, beforeKey);
		this._horizontalLayouter.add(key, cmp);
		this._zLayouter.add(key, cmp);
		this._container.add(key, cmp);
		return cmp;
	},
	remove: function(key) {
		var cmp = this._container.remove(key);
		this._verticalLayouter.remove(key);
		this._horizontalLayouter.remove(key);
		this._zLayouter.remove(key);
		return cmp;
	},
	width: delegateGetSet('_horizontalLayouter', 'size'),
	height: delegateGetSet('_verticalLayouter', 'size'),
	depth: delegateGetSet('_zLayouter', 'size'),
	left: delegateGetSet('_horizontalLayouter', 'position'),
	top: delegateGetSet('_verticalLayouter', 'position'),
	zIndex: delegateGetSet('_zLayouter', 'position'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	visible: delegateGetSet('_container', 'visible'),

	// est-ce bien utile ?
/*	content: function(content) {
			// remove current children
			var children = this._verticalLayout.children();
			Object.keys(children).forEach(function(key) {
				this.remove(key);
			}, this);
			// add new children
			content.forEach(function(cmp, i) {
				this.add(i+'', cmp, null);
			}, this);
			return this;
		},
	at: function(key) {
		return this._container.children()[key].cmp;
	},
*/});

},{"./IncrementalContainer":"/media/sylvain/data/projects/absolute/IncrementalContainer.js","./layout/Full":"/media/sylvain/data/projects/absolute/layout/Full.js","./layout/Pile":"/media/sylvain/data/projects/absolute/layout/Pile.js","./layout/ZFlat":"/media/sylvain/data/projects/absolute/layout/ZFlat.js","./utils/delegateGetSet":"/media/sylvain/data/projects/absolute/utils/delegateGetSet.js","ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/VScroll.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
var delegateGetSet = require('./utils/delegateGetSet');

var Marge = require('./layout/Marge');
var DomNodeContainer = require('./DomNodeContainer');


/**
Impose la largeur à son enfant mais pas la hauteur
Crée un domNode avec un ascenseur toujours visible
*/
module.exports = compose(function(content, options) {
	this._content = content;
	this._container = new DomNodeContainer(content);
	content.left(0).top(0).zIndex(0);
	this._container.style({
		overflowX: 'hidden',
		overflowY: options && options.scrollbarDisplay || 'scroll',
	});
	this._horizontalLayouter = new Marge('horizontal', content, 0, options && options.scrollBarSize || 15);
}, {
	width: function(width) {
		if (arguments.length) {
			this._horizontalLayouter.size(width);
			this._container.width(width);
			return this;
		} else {
			return this._container.width();
		}
	},
	height: delegateGetSet('_container', 'height'),
	depth: delegateGetSet('_container', 'depth'),
	left: delegateGetSet('_container', 'left'),
	top: delegateGetSet('_container', 'top'),
	zIndex: delegateGetSet('_container', 'zIndex'),
	parentNode: delegateGetSet('_container', 'parentNode'),
	visible: delegateGetSet('_container', 'visible'),
});

},{"./DomNodeContainer":"/media/sylvain/data/projects/absolute/DomNodeContainer.js","./layout/Marge":"/media/sylvain/data/projects/absolute/layout/Marge.js","./utils/delegateGetSet":"/media/sylvain/data/projects/absolute/utils/delegateGetSet.js","ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/_ContentDelegate.js":[function(require,module,exports){
var delegateGetSet = require('./utils/delegateGetSet');

// délègue tous les get/set des propriétés de layout à '_content'
// réutilisable pour tous les cas où l'on veut simplement déléguer à un composant principal, en surchargeant uniquement certaines méthodes
module.exports = {
	width: delegateGetSet('_content', 'width'),
	height: delegateGetSet('_content', 'height'),
	depth: delegateGetSet('_content', 'depth'),
	left: delegateGetSet('_content', 'left'),
	top: delegateGetSet('_content', 'top'),
	zIndex: delegateGetSet('_content', 'zIndex'),
	parentNode: delegateGetSet('_content', 'parentNode'),
	visible: delegateGetSet('_content', 'visible'),
};
},{"./utils/delegateGetSet":"/media/sylvain/data/projects/absolute/utils/delegateGetSet.js"}],"/media/sylvain/data/projects/absolute/layout/Full.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
/**
Layouter qui positionne et dimensionne tous les enfants à la même position et dimension que lui-même
*/
module.exports = compose(function(axis) {
	this._children = {};
	this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	this._positionProp = (axis === 'vertical' ? 'top' : 'left');
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		this._children[key] = cmp;
		this._applySize(key);
		this._applyPosition(key);
	},
	remove: function(key) {
		delete this._children[key];
	},
	_applySize: function(key) {
		if (this._size) {
			this._children[key][this._sizeProp](this._size);
		}
	},
	_applyPosition: function(key) {
		if (typeof this._position === 'number') {
			this._children[key][this._positionProp](this._position);
		}
	},
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			Object.keys(this._children).forEach(this._applySize, this);
			return this;
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			Object.keys(this._children).forEach(this._applyPosition, this);
			return this;
		} else {
			return this._position;
		}
	},
});
},{"ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/layout/Marge.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');

/**
Layouter qui dimensionne et positionne un enfant de façon réactive en fonction de sa taille et de sa position
*/

module.exports = compose(function(axis, content, headMarge, tailMarge) {
	this._sizeProp = (axis === 'horizontal' ? 'width' : 'height');
	this._positionProp = (axis === 'horizontal' ? 'left' : 'top');
	this._size = null;
	this._position = null;
	this._content = content;
	this._headMarge = headMarge;
	this._tailMarge = tailMarge;
}, {
	size: function(size) {
		if (arguments.length) {
			this._size = size;
			this._sizeContent();
			return this;
		} else {
			return this._size;
		}
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._positionContent();
			return this;
		} else {
			return this._position;
		}
	},
	_sizeContent: function() {
		this._content[this._sizeProp](this._size - (this._headMarge + this._tailMarge));
	},
	_positionContent: function() {
		this._content[this._positionProp](this._position + this._headMarge);
	},
});
},{"ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/layout/Pile.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');

/**
Container qui positionne des enfants de taille fixe dans un ordre donné.
Peut-être utilisé de façon incrémental
*/
module.exports = compose(function(axis) {
	this._children = {};
	this._sizeProp = (axis === 'vertical' ? 'height' : 'width');
	this._positionProp = (axis === 'vertical' ? 'top' : 'left');
	this._firstChildKey = null;
	this._lastChildKey = null;
}, {
	content: function(config) {
		var sizeProp = this._sizeProp;
		var children = this._children = {};
		var offset = 0;
		var previous = null;
		config.forEach(function(child) {
			previous && (children[previous].next = child.key);
			var cmpSize = child.cmp[sizeProp]();
			children[child.key] = {
				previous: previous,
				next: null,
				key: child.key,
				cmp: child.cmp,
				size: cmpSize,
				offset: offset,
			};
			offset += cmpSize;
			previous = child.key;
		}, this);
		this._size = offset;

		this._firstChildKey = config[0].key;
		this._lastChildKey = config[config.length-1].key;
		this._layoutFrom(this._firstChildKey);

		// this._emit('size', this._size);

		return this;
	},
	add: function(key, cmp, beforeKey) {
		beforeKey = beforeKey || null;
		var sizeProp = this._sizeProp;

		var previousKey = beforeKey ? this._children[beforeKey].previous : this._lastChildKey;
		var previousChild = previousKey ? this._children[previousKey] : null;
		var offset = previousChild ? previousChild.offset + previousChild.size : 0;
		var cmpSize = cmp[sizeProp]();
		this._children[key] = {
			previous: previousKey,
			next: beforeKey,
			key: key,
			cmp: cmp,
			size: cmpSize,
			offset: offset,
		};
		previousKey && (this._children[previousKey].next = key);
		beforeKey && (this._children[beforeKey].previous = key);

		this._layoutFrom(key);
		if (beforeKey === this._firstChildKey) {
			this._firstChildKey = key;
		}
		if (beforeKey === null) {
			this._lastChildKey = key;
		}

		this._size = (this._size || 0) + cmpSize;
		// this._emit('size', this._size);
	},
	remove: function(key) {
		var child = this._children[key];

		var previousKey = child.previous;
		var previousChild = previousKey ? this._children[previousKey] : null;

		var nextKey = child.next;
		var nextChild = nextKey ? this._children[nextKey] : null;

		previousChild && (previousChild.next = nextKey);
		nextChild && (nextChild.previous = previousKey);

		this._layoutFrom(nextKey);
		if (previousKey === null) {
			this._firstChildKey = nextKey;
		}
		if (nextKey === null) {
			this._lastChildKey = previousKey;
		}

		delete this._children[key];

		this._size = this._size - child.size;
	},
	_layoutFrom: function(key) {
		var positionProp = this._positionProp;
		var children = this._children;
		while(key) {
			var child = children[key];
			var previousChild = children[child.previous];
			var offset = child.offset = previousChild ? previousChild.offset + previousChild.size : 0;
			child.cmp[positionProp](this._position + offset); // apply offset
			key = child.next;
		}
	},
	children: function() {
		return this._children;
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			this._layoutFrom(this._firstChildKey);
			return this;
		} else {
			return this._position;
		}
	},
	size: function() {
		return this._size;
	},
	// onSize: function(cb) {
	// 	return this._on('size', cb);
	// },
});

},{"ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/layout/ZFlat.js":[function(require,module,exports){
var compose = require('ksf/utils/compose');
/**
Layouter qui positionne tous les enfants à la même position et a comme dimension celle du plus grand enfant (mais ne diminue jamais de taille car en z ça ne sert à rien)
TODO: le rendre réactif
*/
module.exports = compose(function() {
	this._children = {};
	this._size = 0;
}, {
	content: function(cmps) {
		Object.keys(this._children).forEach(this.remove, this);
		Object.keys(cmps).forEach(function(key) {
			this.add(key, cmps[key]);
		}, this);
		return this;
	},
	add: function(key, cmp) {
		this._children[key] = cmp;
		this._applyPosition(key);
		this._updateSize(key);
	},
	remove: function(key) {
		delete this._children[key];
	},
	_updateSize: function(key) {
		var cmpSize = this._children[key].depth();
		if (cmpSize > this._size) {
			this._size = cmpSize;
		}
	},
	_applyPosition: function(key) {
		if (typeof this._position === 'number') {
			this._children[key].zIndex(this._position);
		}
	},
	size: function() {
		return this._size;
	},
	position: function(position) {
		if (arguments.length) {
			this._position = position;
			Object.keys(this._children).forEach(this._applyPosition, this);
			return this;
		} else {
			return this._position;
		}
	},
});
},{"ksf/utils/compose":"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js"}],"/media/sylvain/data/projects/absolute/node_modules/ksf/utils/compose.js":[function(require,module,exports){
var compose = function (base) {
    var constructors = [];
    var prototypes = [];
    var trait;
    var i, props;
    for (i = 0; i < arguments.length; i++) {
        trait = arguments[i];
        if (typeof trait === 'function') {
            constructors.push(trait);
            prototypes.push(trait.prototype);
        } else {
            prototypes.push(trait);
        }
    }
    var constructorsLenght = constructors.length;
    var Ctr = function () {
        for (i = 0; i < constructorsLenght; i++) {
            constructors[i].apply(this, arguments);
        }
    };
    Ctr.prototype = Object.create(typeof base === 'function' ? base.prototype : base);
    for (i = 1; i < prototypes.length; i++) {
        props = prototypes[i];
        for (var key in props) {
            Ctr.prototype[key] = props[key];
        }
    }
    return Ctr;
};
compose.create = function (base) {
    var trait, instance, i, l, props;
    var constructors = [];
    if (typeof base === 'function') {
        instance = Object.create(base.prototype);
        constructors.push(base);
    } else {
        instance = Object.create(base);
    }
    for (i = 1, l = arguments.length; i < l; i++) {
        trait = arguments[i];
        if (typeof trait === 'function') {
            constructors.push(trait);
            props = trait.prototype;
        } else {
            props = trait;
        }
        for (var key in props) {
            instance[key] = props[key];
        }
    }
    for (i = 0, l = constructors.length; i < l; i++) {
        constructors[i].call(instance);
    }
    return instance;
};
module.exports = compose;
},{}],"/media/sylvain/data/projects/absolute/test/demo.js":[function(require,module,exports){
var VScroll = require('../VScroll');
var VPile = require('../VPile');
var Label = require('../Label');

var pile = new VPile().left(0).top(0).zIndex(0);

new VScroll(pile, {scrollbarDisplay: 'auto'}).left(0).top(0).zIndex(0).width(100).height(100).parentNode(document.body);

['syv', 'aur', 'ant', 'leo'].forEach(function(key) {
	pile.add(key, new Label().height(40).value(key));
});
},{"../Label":"/media/sylvain/data/projects/absolute/Label.js","../VPile":"/media/sylvain/data/projects/absolute/VPile.js","../VScroll":"/media/sylvain/data/projects/absolute/VScroll.js"}],"/media/sylvain/data/projects/absolute/utils/delegateGetSet.js":[function(require,module,exports){
module.exports = function delegateGetSet (component, method) {
	return function(value) {
		if (arguments.length) {
			this[component][method](value);
			return this;
		} else {
			return this[component][method]();
		}
	};
};

},{}]},{},["/media/sylvain/data/projects/absolute/test/demo.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEb21Ob2RlQ29udGFpbmVyLmpzIiwiRWxlbWVudC5qcyIsIkluY3JlbWVudGFsQ29udGFpbmVyLmpzIiwiTGFiZWwuanMiLCJWUGlsZS5qcyIsIlZTY3JvbGwuanMiLCJfQ29udGVudERlbGVnYXRlLmpzIiwibGF5b3V0L0Z1bGwuanMiLCJsYXlvdXQvTWFyZ2UuanMiLCJsYXlvdXQvUGlsZS5qcyIsImxheW91dC9aRmxhdC5qcyIsIm5vZGVfbW9kdWxlcy9rc2YvdXRpbHMvY29tcG9zZS5qcyIsInRlc3QvZGVtby5qcyIsInV0aWxzL2RlbGVnYXRlR2V0U2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29tcG9zZSA9IHJlcXVpcmUoJ2tzZi91dGlscy9jb21wb3NlJyk7XG52YXIgRWxtdCA9IHJlcXVpcmUoJy4vRWxlbWVudCcpO1xuXG4vKipcblBlcm1ldCBkZSBwbGFjZXIgdW4gY29tcG9zYW50IGRhbnMgdW4gZG9tTm9kZSBlbmZhbnQgcGx1dMO0dCBxdWUgZGFucyBsZSBwYXJlbnROb2RlIGRpcmVjdGVtZW50IChjcsOpZSB1biBub3V2ZWF1IGNvbnRleHRlKVxuKi9cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZShFbG10LnByb3RvdHlwZSwgIGZ1bmN0aW9uKGNvbnRlbnQpIHtcblx0RWxtdC5jYWxsKHRoaXMsICdkaXYnKTtcblx0Y29udGVudC5wYXJlbnROb2RlKHRoaXMuX2RvbU5vZGUpO1xufSk7IiwidmFyIGNvbXBvc2UgPSByZXF1aXJlKCdrc2YvdXRpbHMvY29tcG9zZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvc2UoZnVuY3Rpb24odGFnKSB7XG5cdHZhciBub2RlID0gdGhpcy5fZG9tTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnIHx8ICdkaXYnKTtcblx0bm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdG5vZGUuc3R5bGUuYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuXHRub2RlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snOyAvLyBlc3QtY2UgbsOpY2Vzc2FpcmUgZGUgbGUgZm9yY2VyIGF1IGTDqW1hcnJhZ2UgP1xuXHR0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbn0sIHtcblx0bGVmdDogZnVuY3Rpb24obGVmdCkge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9sZWZ0ID0gbGVmdDtcblx0XHRcdHRoaXMuX2RvbU5vZGUuc3R5bGUubGVmdCA9IGxlZnQrJ3B4Jztcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbGVmdDtcblx0XHR9XG5cdH0sXG5cdHRvcDogZnVuY3Rpb24odG9wKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3RvcCA9IHRvcDtcblx0XHRcdHRoaXMuX2RvbU5vZGUuc3R5bGUudG9wID0gdG9wKydweCc7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RvcDtcblx0XHR9XG5cdH0sXG5cdHpJbmRleDogZnVuY3Rpb24oekluZGV4KSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3pJbmRleCA9IHpJbmRleDtcblx0XHRcdHRoaXMuX2RvbU5vZGUuc3R5bGUuekluZGV4ID0gekluZGV4O1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl96SW5kZXg7XG5cdFx0fVxuXHR9LFxuXHR3aWR0aDogZnVuY3Rpb24od2lkdGgpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5fd2lkdGggPSB3aWR0aDtcblx0XHRcdHRoaXMuX2RvbU5vZGUuc3R5bGUud2lkdGggPSB3aWR0aCsncHgnO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl93aWR0aDtcblx0XHR9XG5cdH0sXG5cdGhlaWdodDogZnVuY3Rpb24oaGVpZ2h0KSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblx0XHRcdHRoaXMuX2RvbU5vZGUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0KydweCc7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2hlaWdodDtcblx0XHR9XG5cdH0sXG5cdGRlcHRoOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gMTtcblx0fSxcblx0cGFyZW50Tm9kZTogZnVuY3Rpb24ocGFyZW50Tm9kZSkge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRpZiAocGFyZW50Tm9kZSkge1xuXHRcdFx0XHRwYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMuX2RvbU5vZGUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fcGFyZW50Tm9kZSAmJiB0aGlzLl9wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuX2RvbU5vZGUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcGFyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3BhcmVudE5vZGU7XG5cdFx0fVxuXHR9LFxuXHR2aXNpYmxlOiBmdW5jdGlvbih2aXNpYmxlKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3Zpc2libGUgPSB2aXNpYmxlO1xuXHRcdFx0dGhpcy5fZG9tTm9kZS5zdHlsZS5kaXNwbGF5ID0gKHZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdmlzaWJsZTtcblx0XHR9XG5cdH0sXG59LCB7XG5cdHByb3A6IGZ1bmN0aW9uKHByb3AsIHZhbHVlKSB7XG5cdFx0dGhpcy5fZG9tTm9kZVtwcm9wXSA9IHZhbHVlO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRwcm9wczogZnVuY3Rpb24ocHJvcHMpIHtcblx0XHRPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHR0aGlzLnByb3AocHJvcCwgcHJvcHNbcHJvcF0pO1xuXHRcdH0sIHRoaXMpO1xuXHR9LFxuXHRzdHlsZVByb3A6IGZ1bmN0aW9uKHByb3AsIHZhbHVlKSB7XG5cdFx0dGhpcy5fZG9tTm9kZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuXHR9LFxuXHRzdHlsZTogZnVuY3Rpb24oc3R5bGUpIHtcblx0XHRPYmplY3Qua2V5cyhzdHlsZSkuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHR0aGlzLnN0eWxlUHJvcChwcm9wLCBzdHlsZVtwcm9wXSk7XG5cdFx0fSwgdGhpcyk7XG5cdH0sXG59KTtcbiIsInZhciBjb21wb3NlID0gcmVxdWlyZSgna3NmL3V0aWxzL2NvbXBvc2UnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvc2UoZnVuY3Rpb24oKSB7XG5cdHRoaXMuX2NoaWxkcmVuID0ge307XG59LCB7XG5cdGFkZDogZnVuY3Rpb24oa2V5LCBjbXApIHtcblx0XHR0aGlzLl9jaGlsZHJlbltrZXldID0gY21wO1xuXHRcdHRoaXMuX2luc2VydEluUGFyZW50Tm9kZShrZXkpO1xuXHRcdHJldHVybiBjbXA7XG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG5cdFx0dmFyIGNtcCA9IHRoaXMuX2NoaWxkcmVuW2tleV07XG5cdFx0dGhpcy5fcmVtb3ZlRnJvbVBhcmVudE5vZGUoa2V5KTtcblx0XHRkZWxldGUgdGhpcy5fY2hpbGRyZW5ba2V5XTtcblx0XHRyZXR1cm4gY21wO1xuXHR9LFxuXHRwYXJlbnROb2RlOiBmdW5jdGlvbihub2RlKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3BhcmVudE5vZGUgPSBub2RlO1xuXHRcdFx0T2JqZWN0LmtleXModGhpcy5fY2hpbGRyZW4pLmZvckVhY2godGhpcy5faW5zZXJ0SW5QYXJlbnROb2RlLCB0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcGFyZW50Tm9kZTtcblx0XHR9XG5cdH0sXG5cdHZpc2libGU6IGZ1bmN0aW9uKHZpc2libGUpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5fdmlzaWJsZSA9IHZpc2libGU7XG5cdFx0XHRPYmplY3Qua2V5cyh0aGlzLl9jaGlsZHJlbikuZm9yRWFjaCh0aGlzLl9hcHBseVZpc2libGUsIHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl92aXNpYmxlO1xuXHRcdH1cblx0fSxcblx0X2luc2VydEluUGFyZW50Tm9kZTogZnVuY3Rpb24oa2V5KSB7XG5cdFx0dmFyIGNtcCA9IHRoaXMuX2NoaWxkcmVuW2tleV07XG5cdFx0Y21wLnBhcmVudE5vZGUodGhpcy5fcGFyZW50Tm9kZSk7XG5cdH0sXG5cdF9yZW1vdmVGcm9tUGFyZW50Tm9kZTogZnVuY3Rpb24oa2V5KSB7XG5cdFx0dmFyIGNtcCA9IHRoaXMuX2NoaWxkcmVuW2tleV07XG5cdFx0Y21wLnBhcmVudE5vZGUobnVsbCk7XG5cdH0sXG5cdF9hcHBseVZpc2libGU6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHZhciBjbXAgPSB0aGlzLl9jaGlsZHJlbltrZXldO1xuXHRcdGNtcC52aXNpYmxlKHRoaXMuX3Zpc2libGUpO1xuXHR9LFxufSk7IiwidmFyIGNvbXBvc2UgPSByZXF1aXJlKCdrc2YvdXRpbHMvY29tcG9zZScpO1xudmFyIEVsbXQgPSByZXF1aXJlKCcuL0VsZW1lbnQnKTtcbnZhciBfQ29udGVudERlbGVnYXRlID0gcmVxdWlyZSgnLi9fQ29udGVudERlbGVnYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZShfQ29udGVudERlbGVnYXRlLCBmdW5jdGlvbigpIHtcblx0dGhpcy5fY29udGVudCA9IG5ldyBFbG10KCk7XG59LCB7XG5cdHZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHRoaXMuX2NvbnRlbnQucHJvcCgndGV4dENvbnRlbnQnLCAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogJycpKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcbn0pO1xuIiwidmFyIGNvbXBvc2UgPSByZXF1aXJlKCdrc2YvdXRpbHMvY29tcG9zZScpO1xudmFyIGRlbGVnYXRlR2V0U2V0ID0gcmVxdWlyZSgnLi91dGlscy9kZWxlZ2F0ZUdldFNldCcpO1xuXG52YXIgUGlsZSA9IHJlcXVpcmUoJy4vbGF5b3V0L1BpbGUnKTtcbnZhciBGdWxsID0gcmVxdWlyZSgnLi9sYXlvdXQvRnVsbCcpO1xudmFyIFpGbGF0ID0gcmVxdWlyZSgnLi9sYXlvdXQvWkZsYXQnKTtcbnZhciBJbmNyZW1lbnRhbENvbnRhaW5lciA9IHJlcXVpcmUoJy4vSW5jcmVtZW50YWxDb250YWluZXInKTtcblxuXG4vLyBlbXBpbGUgZGVzIGNvbXBvc2FudHMgZW4gJ3RvcCcgbWFpcyBsZXVyIGltcG9zZSBsZSAnd2lkdGgnXG4vLyBpbmNyw6ltZW50YWxcbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZShmdW5jdGlvbigpIHtcblx0dGhpcy5fY29udGFpbmVyID0gbmV3IEluY3JlbWVudGFsQ29udGFpbmVyKCk7XG5cdHRoaXMuX3ZlcnRpY2FsTGF5b3V0ZXIgPSBuZXcgUGlsZSgndmVydGljYWwnKTtcblx0dGhpcy5faG9yaXpvbnRhbExheW91dGVyID0gbmV3IEZ1bGwoJ2hvcml6b250YWwnKTtcblx0dGhpcy5fekxheW91dGVyID0gbmV3IFpGbGF0KCk7XG59LCB7XG5cdGFkZDogZnVuY3Rpb24oa2V5LCBjbXAsIGJlZm9yZUtleSkge1xuXHRcdHRoaXMuX3ZlcnRpY2FsTGF5b3V0ZXIuYWRkKGtleSwgY21wLCBiZWZvcmVLZXkpO1xuXHRcdHRoaXMuX2hvcml6b250YWxMYXlvdXRlci5hZGQoa2V5LCBjbXApO1xuXHRcdHRoaXMuX3pMYXlvdXRlci5hZGQoa2V5LCBjbXApO1xuXHRcdHRoaXMuX2NvbnRhaW5lci5hZGQoa2V5LCBjbXApO1xuXHRcdHJldHVybiBjbXA7XG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG5cdFx0dmFyIGNtcCA9IHRoaXMuX2NvbnRhaW5lci5yZW1vdmUoa2V5KTtcblx0XHR0aGlzLl92ZXJ0aWNhbExheW91dGVyLnJlbW92ZShrZXkpO1xuXHRcdHRoaXMuX2hvcml6b250YWxMYXlvdXRlci5yZW1vdmUoa2V5KTtcblx0XHR0aGlzLl96TGF5b3V0ZXIucmVtb3ZlKGtleSk7XG5cdFx0cmV0dXJuIGNtcDtcblx0fSxcblx0d2lkdGg6IGRlbGVnYXRlR2V0U2V0KCdfaG9yaXpvbnRhbExheW91dGVyJywgJ3NpemUnKSxcblx0aGVpZ2h0OiBkZWxlZ2F0ZUdldFNldCgnX3ZlcnRpY2FsTGF5b3V0ZXInLCAnc2l6ZScpLFxuXHRkZXB0aDogZGVsZWdhdGVHZXRTZXQoJ196TGF5b3V0ZXInLCAnc2l6ZScpLFxuXHRsZWZ0OiBkZWxlZ2F0ZUdldFNldCgnX2hvcml6b250YWxMYXlvdXRlcicsICdwb3NpdGlvbicpLFxuXHR0b3A6IGRlbGVnYXRlR2V0U2V0KCdfdmVydGljYWxMYXlvdXRlcicsICdwb3NpdGlvbicpLFxuXHR6SW5kZXg6IGRlbGVnYXRlR2V0U2V0KCdfekxheW91dGVyJywgJ3Bvc2l0aW9uJyksXG5cdHBhcmVudE5vZGU6IGRlbGVnYXRlR2V0U2V0KCdfY29udGFpbmVyJywgJ3BhcmVudE5vZGUnKSxcblx0dmlzaWJsZTogZGVsZWdhdGVHZXRTZXQoJ19jb250YWluZXInLCAndmlzaWJsZScpLFxuXG5cdC8vIGVzdC1jZSBiaWVuIHV0aWxlID9cbi8qXHRjb250ZW50OiBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0XHQvLyByZW1vdmUgY3VycmVudCBjaGlsZHJlblxuXHRcdFx0dmFyIGNoaWxkcmVuID0gdGhpcy5fdmVydGljYWxMYXlvdXQuY2hpbGRyZW4oKTtcblx0XHRcdE9iamVjdC5rZXlzKGNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0XHR0aGlzLnJlbW92ZShrZXkpO1xuXHRcdFx0fSwgdGhpcyk7XG5cdFx0XHQvLyBhZGQgbmV3IGNoaWxkcmVuXG5cdFx0XHRjb250ZW50LmZvckVhY2goZnVuY3Rpb24oY21wLCBpKSB7XG5cdFx0XHRcdHRoaXMuYWRkKGkrJycsIGNtcCwgbnVsbCk7XG5cdFx0XHR9LCB0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdGF0OiBmdW5jdGlvbihrZXkpIHtcblx0XHRyZXR1cm4gdGhpcy5fY29udGFpbmVyLmNoaWxkcmVuKClba2V5XS5jbXA7XG5cdH0sXG4qL30pO1xuIiwidmFyIGNvbXBvc2UgPSByZXF1aXJlKCdrc2YvdXRpbHMvY29tcG9zZScpO1xudmFyIGRlbGVnYXRlR2V0U2V0ID0gcmVxdWlyZSgnLi91dGlscy9kZWxlZ2F0ZUdldFNldCcpO1xuXG52YXIgTWFyZ2UgPSByZXF1aXJlKCcuL2xheW91dC9NYXJnZScpO1xudmFyIERvbU5vZGVDb250YWluZXIgPSByZXF1aXJlKCcuL0RvbU5vZGVDb250YWluZXInKTtcblxuXG4vKipcbkltcG9zZSBsYSBsYXJnZXVyIMOgIHNvbiBlbmZhbnQgbWFpcyBwYXMgbGEgaGF1dGV1clxuQ3LDqWUgdW4gZG9tTm9kZSBhdmVjIHVuIGFzY2Vuc2V1ciB0b3Vqb3VycyB2aXNpYmxlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBjb21wb3NlKGZ1bmN0aW9uKGNvbnRlbnQsIG9wdGlvbnMpIHtcblx0dGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XG5cdHRoaXMuX2NvbnRhaW5lciA9IG5ldyBEb21Ob2RlQ29udGFpbmVyKGNvbnRlbnQpO1xuXHRjb250ZW50LmxlZnQoMCkudG9wKDApLnpJbmRleCgwKTtcblx0dGhpcy5fY29udGFpbmVyLnN0eWxlKHtcblx0XHRvdmVyZmxvd1g6ICdoaWRkZW4nLFxuXHRcdG92ZXJmbG93WTogb3B0aW9ucyAmJiBvcHRpb25zLnNjcm9sbGJhckRpc3BsYXkgfHwgJ3Njcm9sbCcsXG5cdH0pO1xuXHR0aGlzLl9ob3Jpem9udGFsTGF5b3V0ZXIgPSBuZXcgTWFyZ2UoJ2hvcml6b250YWwnLCBjb250ZW50LCAwLCBvcHRpb25zICYmIG9wdGlvbnMuc2Nyb2xsQmFyU2l6ZSB8fCAxNSk7XG59LCB7XG5cdHdpZHRoOiBmdW5jdGlvbih3aWR0aCkge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9ob3Jpem9udGFsTGF5b3V0ZXIuc2l6ZSh3aWR0aCk7XG5cdFx0XHR0aGlzLl9jb250YWluZXIud2lkdGgod2lkdGgpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250YWluZXIud2lkdGgoKTtcblx0XHR9XG5cdH0sXG5cdGhlaWdodDogZGVsZWdhdGVHZXRTZXQoJ19jb250YWluZXInLCAnaGVpZ2h0JyksXG5cdGRlcHRoOiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRhaW5lcicsICdkZXB0aCcpLFxuXHRsZWZ0OiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRhaW5lcicsICdsZWZ0JyksXG5cdHRvcDogZGVsZWdhdGVHZXRTZXQoJ19jb250YWluZXInLCAndG9wJyksXG5cdHpJbmRleDogZGVsZWdhdGVHZXRTZXQoJ19jb250YWluZXInLCAnekluZGV4JyksXG5cdHBhcmVudE5vZGU6IGRlbGVnYXRlR2V0U2V0KCdfY29udGFpbmVyJywgJ3BhcmVudE5vZGUnKSxcblx0dmlzaWJsZTogZGVsZWdhdGVHZXRTZXQoJ19jb250YWluZXInLCAndmlzaWJsZScpLFxufSk7XG4iLCJ2YXIgZGVsZWdhdGVHZXRTZXQgPSByZXF1aXJlKCcuL3V0aWxzL2RlbGVnYXRlR2V0U2V0Jyk7XG5cbi8vIGTDqWzDqGd1ZSB0b3VzIGxlcyBnZXQvc2V0IGRlcyBwcm9wcmnDqXTDqXMgZGUgbGF5b3V0IMOgICdfY29udGVudCdcbi8vIHLDqXV0aWxpc2FibGUgcG91ciB0b3VzIGxlcyBjYXMgb8O5IGwnb24gdmV1dCBzaW1wbGVtZW50IGTDqWzDqWd1ZXIgw6AgdW4gY29tcG9zYW50IHByaW5jaXBhbCwgZW4gc3VyY2hhcmdlYW50IHVuaXF1ZW1lbnQgY2VydGFpbmVzIG3DqXRob2Rlc1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHdpZHRoOiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRlbnQnLCAnd2lkdGgnKSxcblx0aGVpZ2h0OiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRlbnQnLCAnaGVpZ2h0JyksXG5cdGRlcHRoOiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRlbnQnLCAnZGVwdGgnKSxcblx0bGVmdDogZGVsZWdhdGVHZXRTZXQoJ19jb250ZW50JywgJ2xlZnQnKSxcblx0dG9wOiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRlbnQnLCAndG9wJyksXG5cdHpJbmRleDogZGVsZWdhdGVHZXRTZXQoJ19jb250ZW50JywgJ3pJbmRleCcpLFxuXHRwYXJlbnROb2RlOiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRlbnQnLCAncGFyZW50Tm9kZScpLFxuXHR2aXNpYmxlOiBkZWxlZ2F0ZUdldFNldCgnX2NvbnRlbnQnLCAndmlzaWJsZScpLFxufTsiLCJ2YXIgY29tcG9zZSA9IHJlcXVpcmUoJ2tzZi91dGlscy9jb21wb3NlJyk7XG4vKipcbkxheW91dGVyIHF1aSBwb3NpdGlvbm5lIGV0IGRpbWVuc2lvbm5lIHRvdXMgbGVzIGVuZmFudHMgw6AgbGEgbcOqbWUgcG9zaXRpb24gZXQgZGltZW5zaW9uIHF1ZSBsdWktbcOqbWVcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvc2UoZnVuY3Rpb24oYXhpcykge1xuXHR0aGlzLl9jaGlsZHJlbiA9IHt9O1xuXHR0aGlzLl9zaXplUHJvcCA9IChheGlzID09PSAndmVydGljYWwnID8gJ2hlaWdodCcgOiAnd2lkdGgnKTtcblx0dGhpcy5fcG9zaXRpb25Qcm9wID0gKGF4aXMgPT09ICd2ZXJ0aWNhbCcgPyAndG9wJyA6ICdsZWZ0Jyk7XG59LCB7XG5cdGNvbnRlbnQ6IGZ1bmN0aW9uKGNtcHMpIHtcblx0XHRPYmplY3Qua2V5cyh0aGlzLl9jaGlsZHJlbikuZm9yRWFjaCh0aGlzLnJlbW92ZSwgdGhpcyk7XG5cdFx0T2JqZWN0LmtleXMoY21wcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdHRoaXMuYWRkKGtleSwgY21wc1trZXldKTtcblx0XHR9LCB0aGlzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0YWRkOiBmdW5jdGlvbihrZXksIGNtcCkge1xuXHRcdHRoaXMuX2NoaWxkcmVuW2tleV0gPSBjbXA7XG5cdFx0dGhpcy5fYXBwbHlTaXplKGtleSk7XG5cdFx0dGhpcy5fYXBwbHlQb3NpdGlvbihrZXkpO1xuXHR9LFxuXHRyZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuXHRcdGRlbGV0ZSB0aGlzLl9jaGlsZHJlbltrZXldO1xuXHR9LFxuXHRfYXBwbHlTaXplOiBmdW5jdGlvbihrZXkpIHtcblx0XHRpZiAodGhpcy5fc2l6ZSkge1xuXHRcdFx0dGhpcy5fY2hpbGRyZW5ba2V5XVt0aGlzLl9zaXplUHJvcF0odGhpcy5fc2l6ZSk7XG5cdFx0fVxuXHR9LFxuXHRfYXBwbHlQb3NpdGlvbjogZnVuY3Rpb24oa2V5KSB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzLl9wb3NpdGlvbiA9PT0gJ251bWJlcicpIHtcblx0XHRcdHRoaXMuX2NoaWxkcmVuW2tleV1bdGhpcy5fcG9zaXRpb25Qcm9wXSh0aGlzLl9wb3NpdGlvbik7XG5cdFx0fVxuXHR9LFxuXHRzaXplOiBmdW5jdGlvbihzaXplKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3NpemUgPSBzaXplO1xuXHRcdFx0T2JqZWN0LmtleXModGhpcy5fY2hpbGRyZW4pLmZvckVhY2godGhpcy5fYXBwbHlTaXplLCB0aGlzKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc2l6ZTtcblx0XHR9XG5cdH0sXG5cdHBvc2l0aW9uOiBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXHRcdFx0T2JqZWN0LmtleXModGhpcy5fY2hpbGRyZW4pLmZvckVhY2godGhpcy5fYXBwbHlQb3NpdGlvbiwgdGhpcyk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuXHRcdH1cblx0fSxcbn0pOyIsInZhciBjb21wb3NlID0gcmVxdWlyZSgna3NmL3V0aWxzL2NvbXBvc2UnKTtcblxuLyoqXG5MYXlvdXRlciBxdWkgZGltZW5zaW9ubmUgZXQgcG9zaXRpb25uZSB1biBlbmZhbnQgZGUgZmHDp29uIHLDqWFjdGl2ZSBlbiBmb25jdGlvbiBkZSBzYSB0YWlsbGUgZXQgZGUgc2EgcG9zaXRpb25cbiovXG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZShmdW5jdGlvbihheGlzLCBjb250ZW50LCBoZWFkTWFyZ2UsIHRhaWxNYXJnZSkge1xuXHR0aGlzLl9zaXplUHJvcCA9IChheGlzID09PSAnaG9yaXpvbnRhbCcgPyAnd2lkdGgnIDogJ2hlaWdodCcpO1xuXHR0aGlzLl9wb3NpdGlvblByb3AgPSAoYXhpcyA9PT0gJ2hvcml6b250YWwnID8gJ2xlZnQnIDogJ3RvcCcpO1xuXHR0aGlzLl9zaXplID0gbnVsbDtcblx0dGhpcy5fcG9zaXRpb24gPSBudWxsO1xuXHR0aGlzLl9jb250ZW50ID0gY29udGVudDtcblx0dGhpcy5faGVhZE1hcmdlID0gaGVhZE1hcmdlO1xuXHR0aGlzLl90YWlsTWFyZ2UgPSB0YWlsTWFyZ2U7XG59LCB7XG5cdHNpemU6IGZ1bmN0aW9uKHNpemUpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5fc2l6ZSA9IHNpemU7XG5cdFx0XHR0aGlzLl9zaXplQ29udGVudCgpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9zaXplO1xuXHRcdH1cblx0fSxcblx0cG9zaXRpb246IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG5cdFx0XHR0aGlzLl9wb3NpdGlvbkNvbnRlbnQoKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcG9zaXRpb247XG5cdFx0fVxuXHR9LFxuXHRfc2l6ZUNvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2NvbnRlbnRbdGhpcy5fc2l6ZVByb3BdKHRoaXMuX3NpemUgLSAodGhpcy5faGVhZE1hcmdlICsgdGhpcy5fdGFpbE1hcmdlKSk7XG5cdH0sXG5cdF9wb3NpdGlvbkNvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2NvbnRlbnRbdGhpcy5fcG9zaXRpb25Qcm9wXSh0aGlzLl9wb3NpdGlvbiArIHRoaXMuX2hlYWRNYXJnZSk7XG5cdH0sXG59KTsiLCJ2YXIgY29tcG9zZSA9IHJlcXVpcmUoJ2tzZi91dGlscy9jb21wb3NlJyk7XG5cbi8qKlxuQ29udGFpbmVyIHF1aSBwb3NpdGlvbm5lIGRlcyBlbmZhbnRzIGRlIHRhaWxsZSBmaXhlIGRhbnMgdW4gb3JkcmUgZG9ubsOpLlxuUGV1dC3DqnRyZSB1dGlsaXPDqSBkZSBmYcOnb24gaW5jcsOpbWVudGFsXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBjb21wb3NlKGZ1bmN0aW9uKGF4aXMpIHtcblx0dGhpcy5fY2hpbGRyZW4gPSB7fTtcblx0dGhpcy5fc2l6ZVByb3AgPSAoYXhpcyA9PT0gJ3ZlcnRpY2FsJyA/ICdoZWlnaHQnIDogJ3dpZHRoJyk7XG5cdHRoaXMuX3Bvc2l0aW9uUHJvcCA9IChheGlzID09PSAndmVydGljYWwnID8gJ3RvcCcgOiAnbGVmdCcpO1xuXHR0aGlzLl9maXJzdENoaWxkS2V5ID0gbnVsbDtcblx0dGhpcy5fbGFzdENoaWxkS2V5ID0gbnVsbDtcbn0sIHtcblx0Y29udGVudDogZnVuY3Rpb24oY29uZmlnKSB7XG5cdFx0dmFyIHNpemVQcm9wID0gdGhpcy5fc2l6ZVByb3A7XG5cdFx0dmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4gPSB7fTtcblx0XHR2YXIgb2Zmc2V0ID0gMDtcblx0XHR2YXIgcHJldmlvdXMgPSBudWxsO1xuXHRcdGNvbmZpZy5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG5cdFx0XHRwcmV2aW91cyAmJiAoY2hpbGRyZW5bcHJldmlvdXNdLm5leHQgPSBjaGlsZC5rZXkpO1xuXHRcdFx0dmFyIGNtcFNpemUgPSBjaGlsZC5jbXBbc2l6ZVByb3BdKCk7XG5cdFx0XHRjaGlsZHJlbltjaGlsZC5rZXldID0ge1xuXHRcdFx0XHRwcmV2aW91czogcHJldmlvdXMsXG5cdFx0XHRcdG5leHQ6IG51bGwsXG5cdFx0XHRcdGtleTogY2hpbGQua2V5LFxuXHRcdFx0XHRjbXA6IGNoaWxkLmNtcCxcblx0XHRcdFx0c2l6ZTogY21wU2l6ZSxcblx0XHRcdFx0b2Zmc2V0OiBvZmZzZXQsXG5cdFx0XHR9O1xuXHRcdFx0b2Zmc2V0ICs9IGNtcFNpemU7XG5cdFx0XHRwcmV2aW91cyA9IGNoaWxkLmtleTtcblx0XHR9LCB0aGlzKTtcblx0XHR0aGlzLl9zaXplID0gb2Zmc2V0O1xuXG5cdFx0dGhpcy5fZmlyc3RDaGlsZEtleSA9IGNvbmZpZ1swXS5rZXk7XG5cdFx0dGhpcy5fbGFzdENoaWxkS2V5ID0gY29uZmlnW2NvbmZpZy5sZW5ndGgtMV0ua2V5O1xuXHRcdHRoaXMuX2xheW91dEZyb20odGhpcy5fZmlyc3RDaGlsZEtleSk7XG5cblx0XHQvLyB0aGlzLl9lbWl0KCdzaXplJywgdGhpcy5fc2l6ZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0YWRkOiBmdW5jdGlvbihrZXksIGNtcCwgYmVmb3JlS2V5KSB7XG5cdFx0YmVmb3JlS2V5ID0gYmVmb3JlS2V5IHx8IG51bGw7XG5cdFx0dmFyIHNpemVQcm9wID0gdGhpcy5fc2l6ZVByb3A7XG5cblx0XHR2YXIgcHJldmlvdXNLZXkgPSBiZWZvcmVLZXkgPyB0aGlzLl9jaGlsZHJlbltiZWZvcmVLZXldLnByZXZpb3VzIDogdGhpcy5fbGFzdENoaWxkS2V5O1xuXHRcdHZhciBwcmV2aW91c0NoaWxkID0gcHJldmlvdXNLZXkgPyB0aGlzLl9jaGlsZHJlbltwcmV2aW91c0tleV0gOiBudWxsO1xuXHRcdHZhciBvZmZzZXQgPSBwcmV2aW91c0NoaWxkID8gcHJldmlvdXNDaGlsZC5vZmZzZXQgKyBwcmV2aW91c0NoaWxkLnNpemUgOiAwO1xuXHRcdHZhciBjbXBTaXplID0gY21wW3NpemVQcm9wXSgpO1xuXHRcdHRoaXMuX2NoaWxkcmVuW2tleV0gPSB7XG5cdFx0XHRwcmV2aW91czogcHJldmlvdXNLZXksXG5cdFx0XHRuZXh0OiBiZWZvcmVLZXksXG5cdFx0XHRrZXk6IGtleSxcblx0XHRcdGNtcDogY21wLFxuXHRcdFx0c2l6ZTogY21wU2l6ZSxcblx0XHRcdG9mZnNldDogb2Zmc2V0LFxuXHRcdH07XG5cdFx0cHJldmlvdXNLZXkgJiYgKHRoaXMuX2NoaWxkcmVuW3ByZXZpb3VzS2V5XS5uZXh0ID0ga2V5KTtcblx0XHRiZWZvcmVLZXkgJiYgKHRoaXMuX2NoaWxkcmVuW2JlZm9yZUtleV0ucHJldmlvdXMgPSBrZXkpO1xuXG5cdFx0dGhpcy5fbGF5b3V0RnJvbShrZXkpO1xuXHRcdGlmIChiZWZvcmVLZXkgPT09IHRoaXMuX2ZpcnN0Q2hpbGRLZXkpIHtcblx0XHRcdHRoaXMuX2ZpcnN0Q2hpbGRLZXkgPSBrZXk7XG5cdFx0fVxuXHRcdGlmIChiZWZvcmVLZXkgPT09IG51bGwpIHtcblx0XHRcdHRoaXMuX2xhc3RDaGlsZEtleSA9IGtleTtcblx0XHR9XG5cblx0XHR0aGlzLl9zaXplID0gKHRoaXMuX3NpemUgfHwgMCkgKyBjbXBTaXplO1xuXHRcdC8vIHRoaXMuX2VtaXQoJ3NpemUnLCB0aGlzLl9zaXplKTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbihrZXkpIHtcblx0XHR2YXIgY2hpbGQgPSB0aGlzLl9jaGlsZHJlbltrZXldO1xuXG5cdFx0dmFyIHByZXZpb3VzS2V5ID0gY2hpbGQucHJldmlvdXM7XG5cdFx0dmFyIHByZXZpb3VzQ2hpbGQgPSBwcmV2aW91c0tleSA/IHRoaXMuX2NoaWxkcmVuW3ByZXZpb3VzS2V5XSA6IG51bGw7XG5cblx0XHR2YXIgbmV4dEtleSA9IGNoaWxkLm5leHQ7XG5cdFx0dmFyIG5leHRDaGlsZCA9IG5leHRLZXkgPyB0aGlzLl9jaGlsZHJlbltuZXh0S2V5XSA6IG51bGw7XG5cblx0XHRwcmV2aW91c0NoaWxkICYmIChwcmV2aW91c0NoaWxkLm5leHQgPSBuZXh0S2V5KTtcblx0XHRuZXh0Q2hpbGQgJiYgKG5leHRDaGlsZC5wcmV2aW91cyA9IHByZXZpb3VzS2V5KTtcblxuXHRcdHRoaXMuX2xheW91dEZyb20obmV4dEtleSk7XG5cdFx0aWYgKHByZXZpb3VzS2V5ID09PSBudWxsKSB7XG5cdFx0XHR0aGlzLl9maXJzdENoaWxkS2V5ID0gbmV4dEtleTtcblx0XHR9XG5cdFx0aWYgKG5leHRLZXkgPT09IG51bGwpIHtcblx0XHRcdHRoaXMuX2xhc3RDaGlsZEtleSA9IHByZXZpb3VzS2V5O1xuXHRcdH1cblxuXHRcdGRlbGV0ZSB0aGlzLl9jaGlsZHJlbltrZXldO1xuXG5cdFx0dGhpcy5fc2l6ZSA9IHRoaXMuX3NpemUgLSBjaGlsZC5zaXplO1xuXHR9LFxuXHRfbGF5b3V0RnJvbTogZnVuY3Rpb24oa2V5KSB7XG5cdFx0dmFyIHBvc2l0aW9uUHJvcCA9IHRoaXMuX3Bvc2l0aW9uUHJvcDtcblx0XHR2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcblx0XHR3aGlsZShrZXkpIHtcblx0XHRcdHZhciBjaGlsZCA9IGNoaWxkcmVuW2tleV07XG5cdFx0XHR2YXIgcHJldmlvdXNDaGlsZCA9IGNoaWxkcmVuW2NoaWxkLnByZXZpb3VzXTtcblx0XHRcdHZhciBvZmZzZXQgPSBjaGlsZC5vZmZzZXQgPSBwcmV2aW91c0NoaWxkID8gcHJldmlvdXNDaGlsZC5vZmZzZXQgKyBwcmV2aW91c0NoaWxkLnNpemUgOiAwO1xuXHRcdFx0Y2hpbGQuY21wW3Bvc2l0aW9uUHJvcF0odGhpcy5fcG9zaXRpb24gKyBvZmZzZXQpOyAvLyBhcHBseSBvZmZzZXRcblx0XHRcdGtleSA9IGNoaWxkLm5leHQ7XG5cdFx0fVxuXHR9LFxuXHRjaGlsZHJlbjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuXHR9LFxuXHRwb3NpdGlvbjogZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcblx0XHRcdHRoaXMuX2xheW91dEZyb20odGhpcy5fZmlyc3RDaGlsZEtleSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuXHRcdH1cblx0fSxcblx0c2l6ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3NpemU7XG5cdH0sXG5cdC8vIG9uU2l6ZTogZnVuY3Rpb24oY2IpIHtcblx0Ly8gXHRyZXR1cm4gdGhpcy5fb24oJ3NpemUnLCBjYik7XG5cdC8vIH0sXG59KTtcbiIsInZhciBjb21wb3NlID0gcmVxdWlyZSgna3NmL3V0aWxzL2NvbXBvc2UnKTtcbi8qKlxuTGF5b3V0ZXIgcXVpIHBvc2l0aW9ubmUgdG91cyBsZXMgZW5mYW50cyDDoCBsYSBtw6ptZSBwb3NpdGlvbiBldCBhIGNvbW1lIGRpbWVuc2lvbiBjZWxsZSBkdSBwbHVzIGdyYW5kIGVuZmFudCAobWFpcyBuZSBkaW1pbnVlIGphbWFpcyBkZSB0YWlsbGUgY2FyIGVuIHogw6dhIG5lIHNlcnQgw6AgcmllbilcblRPRE86IGxlIHJlbmRyZSByw6lhY3RpZlxuKi9cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZShmdW5jdGlvbigpIHtcblx0dGhpcy5fY2hpbGRyZW4gPSB7fTtcblx0dGhpcy5fc2l6ZSA9IDA7XG59LCB7XG5cdGNvbnRlbnQ6IGZ1bmN0aW9uKGNtcHMpIHtcblx0XHRPYmplY3Qua2V5cyh0aGlzLl9jaGlsZHJlbikuZm9yRWFjaCh0aGlzLnJlbW92ZSwgdGhpcyk7XG5cdFx0T2JqZWN0LmtleXMoY21wcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdHRoaXMuYWRkKGtleSwgY21wc1trZXldKTtcblx0XHR9LCB0aGlzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0YWRkOiBmdW5jdGlvbihrZXksIGNtcCkge1xuXHRcdHRoaXMuX2NoaWxkcmVuW2tleV0gPSBjbXA7XG5cdFx0dGhpcy5fYXBwbHlQb3NpdGlvbihrZXkpO1xuXHRcdHRoaXMuX3VwZGF0ZVNpemUoa2V5KTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbihrZXkpIHtcblx0XHRkZWxldGUgdGhpcy5fY2hpbGRyZW5ba2V5XTtcblx0fSxcblx0X3VwZGF0ZVNpemU6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHZhciBjbXBTaXplID0gdGhpcy5fY2hpbGRyZW5ba2V5XS5kZXB0aCgpO1xuXHRcdGlmIChjbXBTaXplID4gdGhpcy5fc2l6ZSkge1xuXHRcdFx0dGhpcy5fc2l6ZSA9IGNtcFNpemU7XG5cdFx0fVxuXHR9LFxuXHRfYXBwbHlQb3NpdGlvbjogZnVuY3Rpb24oa2V5KSB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzLl9wb3NpdGlvbiA9PT0gJ251bWJlcicpIHtcblx0XHRcdHRoaXMuX2NoaWxkcmVuW2tleV0uekluZGV4KHRoaXMuX3Bvc2l0aW9uKTtcblx0XHR9XG5cdH0sXG5cdHNpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLl9zaXplO1xuXHR9LFxuXHRwb3NpdGlvbjogZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcblx0XHRcdE9iamVjdC5rZXlzKHRoaXMuX2NoaWxkcmVuKS5mb3JFYWNoKHRoaXMuX2FwcGx5UG9zaXRpb24sIHRoaXMpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9wb3NpdGlvbjtcblx0XHR9XG5cdH0sXG59KTsiLCJ2YXIgY29tcG9zZSA9IGZ1bmN0aW9uIChiYXNlKSB7XG4gICAgdmFyIGNvbnN0cnVjdG9ycyA9IFtdO1xuICAgIHZhciBwcm90b3R5cGVzID0gW107XG4gICAgdmFyIHRyYWl0O1xuICAgIHZhciBpLCBwcm9wcztcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRyYWl0ID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAodHlwZW9mIHRyYWl0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcnMucHVzaCh0cmFpdCk7XG4gICAgICAgICAgICBwcm90b3R5cGVzLnB1c2godHJhaXQucHJvdG90eXBlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3RvdHlwZXMucHVzaCh0cmFpdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNvbnN0cnVjdG9yc0xlbmdodCA9IGNvbnN0cnVjdG9ycy5sZW5ndGg7XG4gICAgdmFyIEN0ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbnN0cnVjdG9yc0xlbmdodDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ3RyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUodHlwZW9mIGJhc2UgPT09ICdmdW5jdGlvbicgPyBiYXNlLnByb3RvdHlwZSA6IGJhc2UpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBwcm90b3R5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByb3BzID0gcHJvdG90eXBlc1tpXTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICAgICAgICBDdHIucHJvdG90eXBlW2tleV0gPSBwcm9wc1trZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBDdHI7XG59O1xuY29tcG9zZS5jcmVhdGUgPSBmdW5jdGlvbiAoYmFzZSkge1xuICAgIHZhciB0cmFpdCwgaW5zdGFuY2UsIGksIGwsIHByb3BzO1xuICAgIHZhciBjb25zdHJ1Y3RvcnMgPSBbXTtcbiAgICBpZiAodHlwZW9mIGJhc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKGJhc2UucHJvdG90eXBlKTtcbiAgICAgICAgY29uc3RydWN0b3JzLnB1c2goYmFzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKGJhc2UpO1xuICAgIH1cbiAgICBmb3IgKGkgPSAxLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0cmFpdCA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaWYgKHR5cGVvZiB0cmFpdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3RydWN0b3JzLnB1c2godHJhaXQpO1xuICAgICAgICAgICAgcHJvcHMgPSB0cmFpdC5wcm90b3R5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wcyA9IHRyYWl0O1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgICAgICAgaW5zdGFuY2Vba2V5XSA9IHByb3BzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChpID0gMCwgbCA9IGNvbnN0cnVjdG9ycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3RydWN0b3JzW2ldLmNhbGwoaW5zdGFuY2UpO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBjb21wb3NlOyIsInZhciBWU2Nyb2xsID0gcmVxdWlyZSgnLi4vVlNjcm9sbCcpO1xudmFyIFZQaWxlID0gcmVxdWlyZSgnLi4vVlBpbGUnKTtcbnZhciBMYWJlbCA9IHJlcXVpcmUoJy4uL0xhYmVsJyk7XG5cbnZhciBwaWxlID0gbmV3IFZQaWxlKCkubGVmdCgwKS50b3AoMCkuekluZGV4KDApO1xuXG5uZXcgVlNjcm9sbChwaWxlLCB7c2Nyb2xsYmFyRGlzcGxheTogJ2F1dG8nfSkubGVmdCgwKS50b3AoMCkuekluZGV4KDApLndpZHRoKDEwMCkuaGVpZ2h0KDEwMCkucGFyZW50Tm9kZShkb2N1bWVudC5ib2R5KTtcblxuWydzeXYnLCAnYXVyJywgJ2FudCcsICdsZW8nXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRwaWxlLmFkZChrZXksIG5ldyBMYWJlbCgpLmhlaWdodCg0MCkudmFsdWUoa2V5KSk7XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlR2V0U2V0IChjb21wb25lbnQsIG1ldGhvZCkge1xuXHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpc1tjb21wb25lbnRdW21ldGhvZF0odmFsdWUpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzW2NvbXBvbmVudF1bbWV0aG9kXSgpO1xuXHRcdH1cblx0fTtcbn07XG4iXX0=
