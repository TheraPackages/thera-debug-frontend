'use strict'
'use babel'

const {Emitter} = require('atom')
const {COMMAND} = require('thera-debug-common-types').Payload
const {Scope, RemoteObject} = require('thera-debug-common-types').Scope

class ScopeModel {
  constructor (service) {
    this.service = service
    this.emitter = new Emitter()
    // mock data
    let localRemoteObj = new RemoteObject()
    // localRemoteObj.type = 'object'
    // localRemoteObj.value = 'this'
    localRemoteObj.properties = [new RemoteObject('object', 'Window', 'this')]
    // this.scope = new Map()
    this.scope = new Scope('Local', localRemoteObj)

    this.service.onNotify(this._notifyHandler.bind(this))
  }

  onChange (handler) {
    this.emitter.on('changed', handler)
  }

  _change () {
    this.emitter.emit('changed', this)
  }

  _notifyHandler (payload) {
    if (payload.command === COMMAND.UPDATE_SCOPE) {
      this.scope = payload.scope
      this._change()
    }
  }

  destroy () {
    this.emitter.dispose()
  }
}

module.exports = ScopeModel
