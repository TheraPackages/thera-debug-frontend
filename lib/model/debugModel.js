'use strict'
'use babel'

const CallStackModel = require('./callStackModel')
const ScopeModel = require('./scopeModel')
const BreakpointModel = require('./breakpointModel')

const callFrameService = require('../service/callFrameService')
const breakpointService = require('../service/breakpointService')
const souceCodeService = require('../service/sourceCodeService').sourceCodeService
const debugControlService = require('../service/debugControlService').debugControlService

class DebugModel {

  constructor () {
    this.data = {}
  }

  reload (service) {
    this.service = service
    this.callStackModel = new CallStackModel(service)
    this.scopeModel = new ScopeModel(service)
    this.breakpointModel = new BreakpointModel(service, this.data.breakpointModel)

    // setup with new model
    callFrameService.reSetupModel(this.callStackModel)
    breakpointService.reSetupModel(this.breakpointModel)
    souceCodeService.reSetupService(service)
    debugControlService.reSetupService(service)
  }

  serialize () {
    let serializeResult = this.service ? {
      breakpointModel: this.breakpointModel ? this.breakpointModel.serialize() : undefined
    } : undefined

    return serializeResult
  }

  deserialize (data) {
    this.data = data
  }

}

module.exports = new DebugModel()
