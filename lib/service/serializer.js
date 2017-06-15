'use strict'
'use babel'

const sanitize = require('sanitize-filename')
const path = require('path')
const fs = require('fs-promise')
const serializeDir = path.join(atom.configDirPath, 'storage')

const version = '0.3.0'

class Serializer {

  serialize (key, object) {
    const filePath = path.join(serializeDir, sanitize(key))
    fs.ensureFile(filePath)
      .then(() => fs.outputJson(filePath, {version: version, data: object}))
      // .then(() => console.log(`serialize to ${filePath}`))
      .catch(() => console.warn('serialize failed'))
  }

  deserialize (key, callback) {
    const filePath = path.join(serializeDir, sanitize(key))
    const _this = this
    fs.readJson(filePath)
      .then((object) => {
        if (callback && _this._valid(object.version)) {
          console.log(`deserialize from ${filePath}`)
          callback(object.data)
        } else if (!_this._valid(object.version)) {
          console.log(`deserialize failed, version mismatch. expect ${version}, found ${object.version}`)
        }
      })
      .catch((err) => console.warn(`deserialize from ${filePath} failed, ${err.message}`))
  }

  _valid (v) {
    const reg = /(\d+\.\d+)\.\d+/g
    return v && new RegExp(reg).exec(version)[1] === new RegExp(reg).exec(v)[1]
  }
}

module.exports = new Serializer()
