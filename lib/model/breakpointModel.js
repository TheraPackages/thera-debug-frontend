'use strict'
'use babel'

const {COMMAND} = require('thera-debug-common-types').Payload
const {Emitter, Disposable} = require('atom')

module.exports =
class BreakpointModel {
  constructor (service) {
    this.breakpoints = []

    this.emitter = new Emitter()
    this.disposable = new Disposable(service.onPaused(this._serviceHandler.bind(this)))
    this.service = service
    service.setBreakPointReference(this.breakpoings)
    this.selectedId = undefined
  }

  _serviceHandler (payload) {
    if (payload.command === COMMAND.RESOLVE_BREAKPOINT) {
      let breakpoint = payload.breakpoint
      let breakpointExist = this.getBreakpointById(breakpoint.id)

      if (!breakpointExist) {
        this.breakpoints.push(breakpoint)
        this.emitter.emit('did-change', {command: BreakpointModel.command().ADD, value: breakpoint})
      } else {
        breakpointExist.enable = breakpoint.enable
        this.emitter.emit('did-change', {command: BreakpointModel.command().ACTIVATE, value: breakpoint})
      }
    } else if (payload.command === COMMAND.REMOVE_BREAKPOINT) {
      this.removeBreakpointByPath(payload.path, payload.line, true)
    }
  }

  static command () {
    return Object.freeze({ADD: 0, REMOVE: 1, ACTIVATE: 2, SELECT: 3})
  }

  getBreakpoints () {
    return this.breakpoints
  }

  getBreakpointsByFile (filePath) {
    return this.breakpoints.filter((ele) => ele.path === filePath)
  }

  observeBreakpoints (callback) {
    if (this.breakpoints.length > 0) {
      callback(this)
    }

    return this.emitter.on('did-change', callback)
  }

  addBreakpoint (file, line) {
    this.service.setBreakpoint(file, line)
  }

  removeBreakpointById (id, callByService = false) {
    if (id === this.selectedId) {
      this.selectedId = undefined
    }

    let tobeRemoved, element
    this.breakpoints.forEach((ele, index) => {
      if (ele.id === id) {
        tobeRemoved = index
        element = ele
      }
    })
    if (tobeRemoved !== undefined) {
      // service correct breakpoint do not need call back to service.
      if (!callByService) {
        this.service.removeBreakpoint(element.path, element.line)
      }

      var breakpointRemove = this.breakpoints.splice(tobeRemoved, 1)[0]
      this.emitter.emit('did-change', {command: BreakpointModel.command().REMOVE, value: breakpointRemove})
    }
  }

  removeBreakpointByPath (path, line, callByService = false) {
    let breakpoint = this.breakpoints.filter((ele) => ele.path === path && ele.line === line)[0]
    if (breakpoint) {
      this.removeBreakpointById(breakpoint.id, callByService)
    }
  }

  setBreakpointActive (id, active) {
    let breakpoint
    this.breakpoints.forEach((ele) => {
      if (ele.id === id) {
        breakpoint = ele
      }
    })

    if (breakpoint) {
      // breakpoint.enable = active
      // if (active) {
      //   // TODO replace breakpoint
      //   this.service.setBreakpoint(breakpoint.path, breakpoint.line)
      // } else {
      //   this.service.removeBreakpoint(breakpoint.id)
      // }
      this.service.setBreakpoint(breakpoint.path, breakpoint.line, active)

      // this.emitter.emit('did-change', {command: BreakpointModel.command().ACTIVATE, value: breakpoint})
    }
  }

  getBreakpointById (id) {
    let breakpoint = this.breakpoints.filter((ele) => ele.id === id)[0]
    return breakpoint
  }

  getBreakpointsByPath (path, line) {
    let breakpoints = this.breakpoints
      .filter((ele) => ele.path === path && ele.line === line)
    return breakpoints
  }

  setSelectedId (id) {
    this.selectedId = id
    this.emitter.emit('did-change', {command: BreakpointModel.command().SELECT, value: id})
  }

  destroy () {
    this.emitter.dispose()
    this.disposable.dispose()
  }
}
