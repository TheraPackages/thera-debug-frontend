'use babel'
'use strict'

const {Emitter} = require('atom')

var ServiceProvider = function ServiceProvider () {}

var providers = new Map()
var currentProvider
var emitter = new Emitter()

ServiceProvider.prototype.addProvider = function (provider) {
  providers.set(provider.name, provider)
}

ServiceProvider.prototype.removeAll = function () {
  providers.clear()
}

ServiceProvider.prototype.currentProvider = function () {
  return currentProvider
}

ServiceProvider.prototype.setCurrentProvider = function (provider) {
  currentProvider = provider
  emitter.emit('did-change-provider', provider)
}

ServiceProvider.prototype.observeProvider = function (callback) {
  emitter.on('did-change-provider', (provider) => {
    callback(provider)
  })

  if (currentProvider) {
    callback(currentProvider)
  }
}

ServiceProvider.prototype.get = function (name) {
  return providers.get(name)
}

ServiceProvider.prototype.destroy = function () {
  emitter.dispose()
}

module.exports = new ServiceProvider()
