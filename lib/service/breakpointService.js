'use babel'
'use strict'

const {CompositeDisposable} = require('atom')
const DebugGutter = require('../view/marker/gutter')
const BreakpointModel = require('../model/breakpointModel')
const path = require('path')

const fileFormatSupported = ['.js', '.lua']

class BreakpointService {
  constructor () {
    this._observeBreakpoints = this._observeBreakpoints.bind(this)
    this._observeEditors = this._observeEditors.bind(this)
    this._observeEditorDestroy = this._observeEditorDestroy.bind(this)
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
    const ext = path.extname(editor.getPath())
    if (!this.gutterMap.has(editor.getPath()) && fileFormatSupported.find((e) => e === ext)) {
      let gutter = new DebugGutter(editor, this.model)
      gutter.resumeBreakpoint()
      this.gutterMap.set(editor.getPath(), gutter)

      this.disposeables.add(editor.onDidDestroy(() => this._observeEditorDestroy(editor)))
    }
  }

  _observeEditorDestroy (editor) {
    this.gutterMap.get(editor.getPath()).destroy()
    this.gutterMap.delete(editor.getPath())
  }

  _observeBreakpoints (payload) {
    let command = payload.command
    if (command === BreakpointModel.command().REMOVE) {
      let breakpoints = payload.value
      const _this = this
      breakpoints.forEach((bt) => {
        let gutter = _this.gutterMap.get(bt.path)
        if (gutter) {
          gutter.removeMarker(bt.line)
        }
      })
    } else if (command === BreakpointModel.command().ACTIVATE || command === BreakpointModel.command().ADD) {
      let breakpoint = payload.value
      let gutter = this.gutterMap.get(breakpoint.path)

      if (gutter) {
        gutter.setMarker(breakpoint.line, breakpoint.enable)
      } else {
        console.error(`cannot find gutter of ${breakpoint.path}`)
      }
    }
  }

  destroy () {
    this.this.disposable.dispose()
  }
}

module.exports = new BreakpointService()
