'use babel'
'use strict'

const {COMMAND, SourceCodePayload} = require('thera-debug-common-types').Payload
const {Disposable} = require('atom')
const fsp = require('fs-promise')
const path = require('path')

const PATH_CODE_CAHCE = path.join(atom.getConfigDirPath(), 'storage', 'debug-cache')

//
// resoulve source code and store to local storage
//
class SourceCodeService {
  constructor () {
    this._onResolveSourceCode = this._onResolveSourceCode.bind(this)
  }

  reSetupService (service) {
    this._clear()

    this.service = service
    this.disposable = new Disposable(service.onNotify(this._onResolveSourceCode))

    //
    fsp.ensureDir(PATH_CODE_CAHCE)
    console.log(`store debug source code to ${PATH_CODE_CAHCE}`)
  }

  _onResolveSourceCode (payload) {
    if (payload.command === COMMAND.ADD_SOURCECODE) {
      if (payload.isRemote) {
        const filePath = path.join(PATH_CODE_CAHCE, payload.localURL)
        fsp.outputFile(filePath, payload.content)
      }
    }
  }

  _clear () {
    if (this.disposable) {
      this.disposable.dispose()
    }
  }

  destroy () {
    this._clear()
  }
}

module.exports = new SourceCodeService()
