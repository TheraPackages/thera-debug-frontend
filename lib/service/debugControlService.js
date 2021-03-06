'use babel'
'use strict'

const {Disposable, Emitter} = require('atom')
const {COMMAND} = require('thera-debug-common-types').Payload

const debugStatus = Object.freeze({ STOP: 1, START: 2, PAUSE: 3 })

class DebugControlService {
  constructor () {
    this.status = debugStatus.STOP
    this._debugControlChange = this._debugControlChange.bind(this)
    this.emitter = new Emitter()
  }

  onChange (handler) {
    return this.emitter.on('changed', handler)
  }

  reSetupService (service) {
    this.service = service

    if (this.disposable) {
      this.disposable.dispose()
    }

    this.disposable = new Disposable(this.service.onNotify(this._debugControlChange))
  }

  _debugControlChange (payload) {
    if (payload.command === COMMAND.DEBUGGER_STARTED) {
      this.status = debugStatus.START
      this.emitter.emit('changed', this)
    } else if (payload.command === COMMAND.DEBUGGER_STOPPED) {
      this.status = debugStatus.STOP
      this.emitter.emit('changed', this)
    } else if (payload.command === COMMAND.UPDATE_CALLSTACK) {
      this.status = debugStatus.PAUSE
      this.emitter.emit('changed', this)
    } else if (payload.command === COMMAND.DEBUGGER_RESUMED) {
      this.status = debugStatus.START
      this.emitter.emit('changed', this)
    }
  }
}

module.exports = {
  debugStatus: debugStatus,
  debugControlService: new DebugControlService()
}
