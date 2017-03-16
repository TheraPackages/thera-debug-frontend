'use strict'
'use babel'

const {CompositeDisposable, Range, Point} = require('atom')

// debug gutter for single editor

// 1 display markers
// 2 handle ui events to breakpointModel

class DebugGutter {
  constructor (editor, model) {
    this.editor = editor
    this.model = model
    this.markerMap = new Map()
    this.disposables = new CompositeDisposable(
      editor.observeGutters(this._registerGutterMouseHandlers.bind(this))
    )
  }

  removeMarker (line) {
    let actualLine = line - 1
    let marker = this.markerMap.get(actualLine)
    if (marker) {
      marker.destroy()
      this.markerMap.delete(actualLine)
    }
  }

  activeMarker (line, enable) {
    let actualLine = line - 1
    let marker = this.markerMap.get(actualLine)
    if (marker) {
      this.removeMarker(line)
      this.setMarker(line, enable)
    }
  }

  // _handelGutterDistroy() {
  //
  // }

  // handle gutter click of line-number and linter
  _registerGutterMouseHandlers (gutter) {
    const gutterView = atom.views.getView(gutter)
    if (gutter.name !== 'line-number' && gutter.name !== 'linter') {
      return
    }
    const boundClickHandler = this._handleGutterClick.bind(this)
    const boundMouseMoveHandler = this._handleGutterMouseMove.bind(this)
    const boundMouseLeaveHandler = this._handleGutterMouseLeave.bind(this)

    gutterView.addEventListener('click', boundClickHandler)
    gutterView.addEventListener('mousemove', boundMouseMoveHandler)
    gutterView.addEventListener('mouseleave', boundMouseLeaveHandler)

    // this.disposables.add(
    //   () => gutterView.removeEventListener('click', boundClickHandler),
    //   () => gutterView.removeEventListener('mousemove', boundMouseMoveHandler),
    //   () => gutterView.removeEventListener('mouseleave', boundMouseLeaveHandler)
    // )
  }

  _handleGutterClick (e) {
    // skip clicking on fold icon
    if (e.toElement.className === 'icon-right') {
      return
    }

    // real line number equals Atom marker number plus 1
    const range = this.editor.getSelectedBufferRange()
    const line = range.start.row + 1
    const path = this.editor.getPath()

    let breakpoints = this.model.getBreakpointsByPath(path, line)

    if (breakpoints && breakpoints.length > 0) {
      breakpoints.forEach((breakpoint) => {
        this.model.removeBreakpointById(breakpoint.id)
      })
    } else {
      this.model.addBreakpoint(path, line)
    }
  }

  setMarker (line, enable = true) {
    // Atom marker must substract 1 from real line
    const actualLine = line - 1
    const range = new Range(new Point(actualLine, 0), new Point(actualLine, 0))
    const marker = this.editor.markBufferRange(range, {invalidate: 'never'})

    marker.onDidChange(this._handleMarkerChange.bind(this))
    this.editor.decorateMarker(marker,
      {type: 'line-number', class: enable ? 'line-number-breakpoint' : 'line-number-breakpoint-disable'})
    this.markerMap.set(actualLine, marker)
  }

  // handle editor line changes
  _handleMarkerChange (event) {
    const path = this.editor.getPath()
    if (!event.isValid) {
      this.model.removeBreakpointByPath(path, event.newHeadBufferPosition.row + 1)
    } else if (event.oldHeadBufferPosition.row !== event.newHeadBufferPosition.row) {
      this.model.removeBreakpointByPath(path, event.oldHeadBufferPosition.row + 1)
      this.model.addBreakpoint(path, event.oldHeadBufferPosition.row + 1)
    }
  }

  _handleGutterMouseMove () {

  }

  _handleGutterMouseLeave () {

  }

  destroy () {
    this.disposables.dispose()
    this.markerMap.forEach((ele) => ele.destroy())
    this.markerMap.clear()
  }
}

module.exports = DebugGutter
