'use babel'
'use strict'

const serviceProvider = require('./service/serviceProvider')
const TestServiceProvider = require('../test/testService')
const debugPanel = require('./view/panel/debugPanel')
const debugModel = require('./model/debugModel')
const {ResumedPayload} = require('thera-debug-common-types').Payload
const fsp = require('fs-promise')
const fs = require('fs')
const path = require('path')

const CMD_SHOW = 'modalPanel:show-debug-panel'
const CMD_HIDE = 'modalPanel:hide-debug-panel'
const CMD_DEBUG = 'thera-live-server:debug'
const CMD_STOP = 'thera-live-server:stop'

const serializeVer = '0.1.0'

module.exports = {

  cosumeDebugService (service) {
    serviceProvider.addProvider(service)
    this.activateService()
    console.log(`add debug service ${service.name}`)
  },

  theraServiceProvider () {
    return serviceProvider
  },

  // serialization use atom serialize service
  serialize () {
    let serializeData = {debugModel: debugModel.serialize(), version: serializeVer}
    return {deserializer: 'thera-debug-frontend', data: serializeData}
  },

  deserialize ({data}) {
    const reg = /(\d+\.\d+)\.\d+/g
    if (data.version && new RegExp(reg).exec(data.version)[1] === new RegExp(reg).exec(serializeVer)[1]) {
      debugModel.deserialize(data.debugModel)
      console.log('deserialized package thera-debug-frontend')
    } else {
      console.warn(`deserialize failed, version mismatch. cur ${serializeVer}, found ${data.version}`)
    }
  },

  // show case of debug service provider
  provideDebugService () {
    return new TestServiceProvider()
  },

  activate (state) {
    let _this = this
    if (state) {
      atom.deserializers.deserialize(state)
    }

    atom.commands.add(atom.commands.rootNode, CMD_SHOW, () => _this.activateService(debugPanel.show()))
    atom.commands.add(atom.commands.rootNode, CMD_HIDE, () => _this.hide())
    atom.commands.add(atom.commands.rootNode, CMD_DEBUG, (entranceURL) => _this.startDebug(entranceURL))
    atom.commands.add(atom.commands.rootNode, CMD_STOP, () => _this.stopDebug())
    window.addEventListener('load', () => _this.activateService())
  },

  deactivate () {

  },

  // show () {
  //   this.activateService(() => debugPanel.show())
  // },

  hide () {
    debugPanel.hide()
  },

  startDebug (entranceURL) {
    this.activateService(() => serviceProvider.currentProvider().startDebug())
  },

  stopDebug () {
    if (serviceProvider.currentProvider()) {
      serviceProvider.currentProvider().notify(new ResumedPayload())
      serviceProvider.currentProvider().stopDebug()
    }
  },

  activateService (callback) {
    if (!atom.project.getDirectories()[0]) {
      return
    }

    let projectPath = atom.project.getDirectories()[0].path
    let lanuchConfigPath = path.join(projectPath, '.thera', 'launch.json')
    fs.exists(lanuchConfigPath, (exists) => {
      if (exists) {
        fsp.readJson(lanuchConfigPath)
          .then((lanuchConfig) => {
            if (!serviceProvider.currentProvider() || serviceProvider.currentProvider().name !== lanuchConfig.type) {
              var service = serviceProvider.get(lanuchConfig.type)

              if (service) {
                serviceProvider.setCurrentProvider(service)
                debugModel.reload(service)
              }
            }

            if (callback) {
              callback()
            }
          })
      } else {
        let packagePath = atom.packages.resolvePackagePath('atom-notifier')
        if (packagePath) {
          const atomNotifier = require(packagePath)
          atomNotifier.send({
            getType: () => 'warning',
            getMessage: () => 'Cannot find project configuration',
            getDetail: () => 'Cannot find project configuration'
          })
        }
        console.warn('Cannot find project configuration use Weex by default debug service')
        let service = serviceProvider.get('weex')
        if (service) {
          serviceProvider.setCurrentProvider(service)
          debugModel.reload(service)
        }
        if (callback) callback()
      }
    })
  }
}
