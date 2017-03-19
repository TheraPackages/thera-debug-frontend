'use babel'
'use strict'

const serviceProvider = require('./service/serviceProvider')
// const TestServiceProvider = require('../test/testService')
const debugPanel = require('./view/panel/debugPanel')
const debugModel = require('./model/debugModel')
const {ResumedPayload} = require('thera-debug-common-types').Payload
const fsp = require('fs-promise')
const path = require('path')

const CMD_SHOW = 'modalPanel:show-debug-panel'
const CMD_HIDE = 'modalPanel:hide-debug-panel'
const CMD_DEBUG = 'thera-live-server:debug'
const CMD_STOP = 'thera-live-server:stop'

module.exports = {

  cosumeDebugService (service) {
    serviceProvider.addProvider(service)
    console.log(`add debug service ${service.name}`)
  },

  // show case of debug service provider
  // provideDebugService () {
  //   return new TestServiceProvider()
  // },

  activate () {
    let _this = this
    atom.commands.add(atom.commands.rootNode, CMD_SHOW, () => _this.show())
    atom.commands.add(atom.commands.rootNode, CMD_HIDE, () => _this.hide())
    atom.commands.add(atom.commands.rootNode, CMD_DEBUG, (entranceURL) => _this.startDebug(entranceURL))
    atom.commands.add(atom.commands.rootNode, CMD_STOP, () => _this.stopDebug())
  },

  deactivate () {

  },

  show () {
    this.activateService()
  },

  hide () {
    debugPanel.hide()
  },

  startDebug (entranceURL) {
    serviceProvider.currentProvider().startDebug()
  },

  stopDebug () {
    serviceProvider.currentProvider().notify(new ResumedPayload())
    serviceProvider.currentProvider().stopDebug()
  },

  activateService () {
    let projectPath = atom.project.getDirectories()[0].path
    let lanuchConfigPath = path.join(projectPath, '.thera', 'launch.json')
    fsp.readJson(lanuchConfigPath)
      .then((lanuchConfig) => {
        if (!serviceProvider.currentProvider() || serviceProvider.currentProvider().name !== lanuchConfig.type) {
          var service = serviceProvider.get(lanuchConfig.type)

          if (service) {
            serviceProvider.setCurrentProvider(service)
            debugModel.reload(service)
          }
        }

        debugPanel.show()
      })
  }
}
