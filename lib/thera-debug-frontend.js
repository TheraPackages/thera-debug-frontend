'use babel'
'use strict'

const serviceProvider = require('./service/serviceProvider')
const TestServiceProvider = require('../test/testService')
const debugPanel = require('./view/panel/debugPanel')
const debugModel = require('./model/debugModel')

const CMD_SHOW = 'modalPanel:show-debug-panel'
const CMD_HIDE = 'modalPanel:hide-debug-panel'
const CMD_DEBUG = 'thera-debug-frontend:debug'

module.exports = {

  cosumeDebugService (service) {
    serviceProvider.addProvider(service)

    this.activateService(service.name)
  },

  provideDebugService () {
    return new TestServiceProvider()
  },

  activate () {
    let _this = this
    atom.commands.add(atom.commands.rootNode, CMD_SHOW, () => _this.show())
    atom.commands.add(atom.commands.rootNode, CMD_HIDE, () => _this.hide())
    atom.commands.add(atom.commands.rootNode, CMD_DEBUG, (entranceURL) => _this.startDebug(entranceURL))
  },

  deactivate () {

  },

  show () {
    debugPanel.show()
  },

  hide () {
    debugPanel.hide()
  },

  startDebug (entranceURL) {
    serviceProvider.currentProvider.startDebug(entranceURL)
  },

  activateService (name) {
    var service = serviceProvider.get(name)
    serviceProvider.setCurrentProvider(service)
    debugModel.reload(service)
  }
}
