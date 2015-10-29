module.exports = function(get, set) {
  return function(value) {
    if (arguments.length > 0) {
      // set
      set.call(this, value)
      return this
    } else {
      // get
      return get.call(this)
    }
  }
}
