var capitalize = require('lodash/string/capitalize')

module.exports = function(eventName) {
  var methods = {}
  methods['on' + capitalize(eventName)] = function(cb) {
    this._on(eventName, cb)
    return this
  }
  methods['off' + capitalize(eventName)] = function(cb) {
    this._off(eventName, cb)
    return this
  }
  return methods
}
