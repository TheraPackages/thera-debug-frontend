'use strict'
'use babel'

class Payload {
  constructor (command) {
    this.command = command
  }
}

class CallStackPayload extends Payload {
  constructor (callFrames, reason, hitBreakpoints, currentCallFrameId) {
    super(COMMAND.UPDATE_CALLSTACK)
    this.callFrames = callFrames
    this.reason = reason
    this.hitBreakpoints = hitBreakpoints
    this.currentCallFrameId = currentCallFrameId
  }
}

class ResolveBreakpointPayload extends Payload {
  constructor (breakpoint) {
    super(COMMAND.RESOLVE_BREAKPOINT)
    this.breakpoint = breakpoint
  }
}

var COMMAND = Object.freeze({
  UPDATE_CALLSTACK: 'UPDATE_CALLSTACK',
  RESOLVE_BREAKPOINT: 'RESOLVE_BREAKPOINT'
})

module.exports = {
  COMMAND: COMMAND,
  CallStackPayload: CallStackPayload,
  ResolveBreakpointPayload: ResolveBreakpointPayload
}
