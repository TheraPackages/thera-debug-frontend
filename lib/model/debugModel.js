'use strict'
'use babel'

const CallStackModel = require('./callStackModel')
const ScopeModel = require('./scopeModel')
const BreakpointModel = require('./breakpointModel')

const callFrameService = require('../service/callFrameService')
const breakpointService = require('../service/breakpointService')

class DebugModel {

  reload (service) {
    this.callStackModel = new CallStackModel(service)
    this.scopeModel = new ScopeModel(service)
    this.breakpointModel = new BreakpointModel(service)

    // setup with new model
    callFrameService.reSetupModel(this.callStackModel)
    breakpointService.reSetupModel(this.breakpointModel)
  }
}

module.exports = new DebugModel()
