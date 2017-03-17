'use strict'
'use babel'

const {Disposable} = require('atom')
const {PATH_CODE_CAHCE} = require('./sourceCodeService')
const path = require('path')

class CallFrameService {

  reSetupModel (callStackModel) {
    //
    this._clearCallStackMarker()
    if (this.disposable) {
      this.disposable.dispose()
      this.disposable = null
    }

    //
    this.model = callStackModel
    this.disposable = new Disposable(this.model.onChange(this._modelChangeHandler.bind(this)))
  }

  _modelChangeHandler () {
    let callStack = this.model.getCallStack()

    if (callStack.length > 0) {
      let callFrame = callStack[this.model.getSelectedIndex()]
      let filePath = callFrame.fileURL
      let lineNumber = callFrame.location.lineNumber || callFrame.location
      let actualNumber = lineNumber - 1

      var _this = this
      let absolutePath = this._convertToAbsolutePath(filePath)
      atom.workspace.open(absolutePath, {searchAllPanes: true}).then(editor => {
        _this._clearCallStackMarker()
        _this._nagivateToLocation(editor, actualNumber)
        _this._highlightLine(editor, actualNumber)
      })
    } else {
      this._clearCallStackMarker()
    }
  }

  _convertToAbsolutePath (filePath) {
    let abPath
    if (path.isAbsolute(filePath)) {
      abPath = filePath
    } else {
      abPath = path.join(PATH_CODE_CAHCE, filePath)
    }
    return abPath
  }

  _highlightLine (editor, lineNumber) {
    // atom eidtor number should minus 1
    const marker = editor.markBufferRange(
      [[lineNumber, 0], [lineNumber, Infinity]],
      {invalidate: 'never'}
    )

    let decoration = editor.decorateMarker(marker, {
      type: 'line',
      class: 'line-orange'
    })
    decoration.properties.style = 'background-color:#ffc107;'
    this.callframeMarker = marker
  }

  _nagivateToLocation (editor, lineNumber) {
    editor.scrollToBufferPosition([lineNumber, 0])
    editor.setCursorBufferPosition([lineNumber, 0])
  }

  _clearCallStackMarker () {
    if (this.callframeMarker) {
      this.callframeMarker.destroy()
      this.callframeMarker = null
    }
  }

  destroy () {
    this.disposable.dispose()
  }
}

module.exports = new CallFrameService()
