'use babel'
'use strict'

const serviceProvider = require('./service/serviceProvider')
// const TestServiceProvider = require('../test/testService')
const debugPanel = require('./view/panel/debugPanel')
const debugModel = require('./model/debugModel')
const {ResumedPayload} = require('thera-debug-common-types').Payload
const serializer = require('./service/serializer')
const fsp = require('fs-promise')
const fs = require('fs')
const path = require('path')

const CMD_SHOW = 'modalPanel:show-debug-panel'
const CMD_HIDE = 'modalPanel:hide-debug-panel'
const CMD_DEBUG = 'thera-live-server:debug'
const CMD_STOP = 'thera-live-server:stop'

const serializeVer = '0.3.0'

module.exports = {

  cosumeDebugService (service) {
    serviceProvider.addProvider(service)
    this._activate()
    console.log(`add debug service ${service.name}`)
  },

  theraServiceProvider () {
    return serviceProvider
  },

  // implement serialization instead of use atom's service.
  // BC project based serialization is needed.
  // TODO build this to a project level serialization service.
  serialize () {
    if (atom.project.getDirectories()[0]) {
      let serilizeObj = debugModel.serialize()
      if (serilizeObj) {
        serializer.serialize(atom.project.getDirectories()[0].path, serilizeObj)
      }
    }

    const serializeData = {version: serializeVer}
    return {deserializer: 'thera-debug-frontend', data: serializeData}
  },

  _deserialize () {
    if (atom.project.getDirectories()[0]) {
      serializer.deserialize(atom.project.getDirectories()[0].path, (serializeData) => {
        debugModel.deserialize(serializeData)
      })
    }
  },

  // show case of debug service provider
  // provideDebugService () {
  //   return new TestServiceProvider()
  // },
  _activate (callback, notify) {
    this._deserialize()
    this.activateService(callback, notify)
  },

  activate (state) {
    const _this = this
    atom.commands.add(atom.commands.rootNode, CMD_SHOW, () => _this._activate(debugPanel.show()))
    atom.commands.add(atom.commands.rootNode, CMD_HIDE, () => _this.hide())
    atom.commands.add(atom.commands.rootNode, CMD_DEBUG, (entranceURL) => {
      _this.startDebug(entranceURL)
      // open debug panel automatically
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'symbols-tree-view:toggle', {activateIndex: 2, show: true})
      debugPanel.show()
    })
    atom.commands.add(atom.commands.rootNode, CMD_STOP, () => _this.stopDebug())
    atom.project.onDidChangePaths((projectPaths) => {
      _this._activate()
    })
    window.addEventListener('load', () => _this._activate())
  },

  deactivate () {

  },

  // show () {
  //   this._activate(() => debugPanel.show())
  // },

  hide () {
    debugPanel.hide()
  },

  startDebug (entranceURL) {
    this._activate(() => serviceProvider.currentProvider().startDebug(), true)
  },

  stopDebug () {
    if (serviceProvider.currentProvider()) {
      serviceProvider.currentProvider().notify(new ResumedPayload())
      serviceProvider.currentProvider().stopDebug()
    }
  },

  activateService (callback, notify = false) {
    if (!atom.project.getDirectories()[0]) {
      console.warn('activate debug servcie failed, cannot find project directory.')
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
        if (packagePath && notify) {
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
