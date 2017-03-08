'use strict'
'use babel'

const {Emitter} = require('atom')
const {COMMAND} = require('thera-debug-common-types').Payload
const {Scope, RemoteObject, PropertyDescriptor, ObjectType} = require('thera-debug-common-types').Scope

class ScopeModel {
  constructor (service) {
    this.service = service
    this.emitter = new Emitter()
    this.scopes = []

    // mock data
    // let roThis = new RemoteObject(ObjectType.OBJECT, 'ScopeModel', undefined, 'local.this')
    // let roNumber = new RemoteObject(ObjectType.NUMBER, undefined, 3, 'local.number')
    // let local = new RemoteObject()
    // local.type = ObjectType.OBJECT
    // local.properties = [new PropertyDescriptor('this', roThis), new PropertyDescriptor('xVar', roNumber)]

    // this.scopes.push(new Scope('Local', local))

    this.service.onNotify(this._notifyHandler.bind(this))
  }

  onChange (handler) {
    return this.emitter.on('changed', handler)
  }

  _change () {
    this.emitter.emit('changed', this)
  }

  _notifyHandler (payload) {
    if (payload.command === COMMAND.CALLFRAME) {
      this.scopes = payload.scopeChain
      this._change()
    }
  }

  destroy () {
    this.emitter.dispose()
  }
}

module.exports = ScopeModel
