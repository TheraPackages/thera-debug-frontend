'use strict'
'use babel'

const {Emitter} = require('atom')

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
    if (payload.command === 'UPDATE_CALLSTACK') {
      this.callstack = payload.callFrames
      this.callstack.forEach((ele, index) => {
        if (ele.callFrameId === payload.currentCallFrameId) {
          this.selectedIndex = index
        }
      }, this)

      this.emitter.emit('changed', this)
    }
  }

  destroy () {
    this.emitter.dispose()
  }
}

module.exports = CallStackModel
