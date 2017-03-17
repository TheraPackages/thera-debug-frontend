'use strict'
'use babel'

const {Emitter} = require('atom')
const {COMMAND} = require('thera-debug-common-types').Payload

class CallStackModel {
  constructor (service) {
    this.service = service
    this.emitter = new Emitter()

    this.selectedIndex = 0

    this.service.onPaused(this._pausedHandler.bind(this))
  }

  getCallStack () {
    return this.callstack
  }

  getSelectedIndex () {
    return this.selectedIndex
  }

  onChange (handler) {
    return this.emitter.on('changed', handler)
  }

  _pausedHandler (payload) {
    if (payload.command === COMMAND.UPDATE_CALLSTACK) {
      this.callstack = payload.callFrames || this.callstack
      this.callstack.forEach((ele, index) => {
        if (ele.callFrameId === payload.currentCallFrameId) {
          this.selectedIndex = index
        }
      }, this)

      this.emitter.emit('changed', this)
    } else if (payload.command === COMMAND.CALLFRAME) {
      this.callstack.forEach((ele, index) => {
        if (ele.callFrameId === payload.id) {
          this.selectedIndex = index
        }
      }, this)

      this.emitter.emit('changed', this)
    } else if (payload.command === COMMAND.DEBUGGER_RESUMED) {
      this.callstack = []
      this.selectedIndex = 0
      this.emitter.emit('changed', this)
    }
  }

  destroy () {
    this.emitter.dispose()
  }
}

module.exports = CallStackModel
