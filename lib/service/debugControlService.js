'use babel'
'use strict'

const debugStatus = Object.freeze({ STOP: 1, START: 2 })

class DebugControlService {
  constructor () {
    this.status = debugStatus.STOP
  }

  reSetupService (service) {
    this.service = service
    // TODO setup listen to service
  }
}

module.exports = {
  debugStatus: debugStatus,
  debugControlService: new DebugControlService()
}
