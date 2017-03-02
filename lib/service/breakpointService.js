'use babel'
'use strict'

const {CompositeDisposable} = require('atom')
const DebugGutter = require('../view/marker/gutter')
const BreakpointModel = require('../model/breakpointModel')

class BreakpointService {
  constructor () {
    this._observeBreakpoints = this._observeBreakpoints.bind(this)
    this._observeEditors = this._observeEditors.bind(this)
    this.gutterMap = new Map()
  }

  reSetupModel (model) {
    if (this.disposables) {
      this.disposables.dispose()
    }

    this.model = model
    this.disposeables = new CompositeDisposable()
    this.disposeables.add(this.model.observeBreakpoints(this._observeBreakpoints))
    this.disposeables.add(atom.workspace.observeTextEditors(this._observeEditors))
  }

  _observeEditors (editor) {
    if (!this.gutterMap.has(editor.getPath())) {
      let gutter = new DebugGutter(editor, this.model)
      this._setupGutter(gutter)
      this.gutterMap.set(editor.getPath(), gutter)
    }
  }

  // TODO persist breakpints
  _setupGutter (gutter) {

  }

  _observeBreakpoints (payload) {
    let breakpoint = payload.value
    let command = payload.command
    let gutter = this.gutterMap.get(breakpoint.path)
    if (gutter) {
      if (command === BreakpointModel.command().REMOVE) {
        gutter.removeMarker(breakpoint.line)
      } else if (command === BreakpointModel.command().ACTIVATE) {
        gutter.activeMarker(breakpoint.line, breakpoint.enable)
      } else if (command === BreakpointModel.command().ADD) {
        gutter.setMarker(breakpoint.line, breakpoint.enable)
      }
    }
  }

  destroy () {
    this.this.disposable.dispose()
  }
}

module.exports = new BreakpointService()
