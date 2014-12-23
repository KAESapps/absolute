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
