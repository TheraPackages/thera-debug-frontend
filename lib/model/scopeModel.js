'use strict'
'use babel'

const {Emitter} = require('atom')

class ScopeModel {
  constructor (service) {
    this.service = service
    this.emitter = new Emitter()
    this.callstack = []

    this.service.onPaused(this._pausedHandler.bind(this))
  }

  onChange (handler) {
    this.emitter.on('changed', handler)
  }

  _change () {
    this.emitter.emit('changed', this)
  }

  _pausedHandler (payload) {
    if (payload.scope) {
      this.scope = payload.scope
      this._change()
    }
  }

  destroy () {
    this.emitter.dispose()
  }
}

module.exports = ScopeModel
