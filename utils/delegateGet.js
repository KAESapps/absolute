module.exports = function delegateGetSet (component, method) {
	return function(value) {
		return this[component][method]();
	};
};
