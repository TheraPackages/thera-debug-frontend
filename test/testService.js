'use babel'
'use strict'

const {DebugService, Breakpoint, CallFrame} = require('thera-debug-common-types')
const {COMMAND,
  CallStackPayload,
  ResolveBreakpointPayload,
  UpdateScopePayload} = require('thera-debug-common-types').Payload

module.exports =
class TestService extends DebugService {
  constructor () {
    super()
    this.name = 'test'
  }

  // callstack
  stepOver () {
    this.line = this.line ? ++this.line : 5

    let callFrames = [
      new CallFrame('0', 'reSetupModel', this.line, '/Users/nickolas/Proj/falcon/thera-debug-frontend/lib/service/callFrameService.js'),
      new CallFrame('1', 'reSetupModel', 6, '/Users/nickolas/Proj/falcon/thera-debug-frontend/lib/service/callFrameService.js'),
      new CallFrame('2', 'reSetupModel', 7, '/Users/nickolas/Proj/falcon/thera-debug-frontend/lib/service/callFrameService.js')
    ]
    let payload = new CallStackPayload(callFrames, 'breakpoint', [], '0')

    // let scopePayload = new UpdateScopePayload({Locals:[
    //   {}
    // ]})

    let _this = this
    setTimeout(() => {
      _this.paused(payload)
    })
  }

  selectCallFrame (callFrameId) {
    let callFrames = [
      new CallFrame('0', 'reSetupModel', 5, '/Users/nickolas/Proj/falcon/thera-debug-frontend/lib/service/callFrameService.js'),
      new CallFrame('1', 'reSetupModel', 6, '/Users/nickolas/Proj/falcon/thera-debug-frontend/lib/service/callFrameService.js'),
      new CallFrame('2', 'reSetupModel', 7, '/Users/nickolas/Proj/falcon/thera-debug-frontend/lib/service/callFrameService.js')
    ]
    let payload = new CallStackPayload(callFrames, 'breakpoint', [], callFrameId)

    let _this = this
    setTimeout(() => {
      _this.paused(payload)
    })
  }

  // breakpoint
  setBreakpoint (file, line) {
    let breakpoint = new Breakpoint(file + ':' + line, file, line, true)
    let payload = new ResolveBreakpointPayload(breakpoint)
    let _this = this
    setTimeout(() => {
      _this.paused(payload)
    })
  }
}
