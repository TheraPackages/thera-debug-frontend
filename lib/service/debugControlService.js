'use babel'
'use strict'

const {Disposable} = require('atom')
const {COMMAND} = require('thera-debug-common-types').Payload

const debugStatus = Object.freeze({ STOP: 1, START: 2 })

class DebugControlService {
  constructor () {
    this.status = debugStatus.STOP
    this._debugControlChange = this._debugControlChange.bind(this)
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
    } else if (payload.command === COMMAND.DEBUGGER_STOPPED) {
      this.status = debugStatus.STOP
    }
  }
}

module.exports = {
  debugStatus: debugStatus,
  debugControlService: new DebugControlService()
}
