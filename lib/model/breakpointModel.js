'use strict'
'use babel'

const {COMMAND} = require('thera-debug-common-types').Payload
const Breakpoint = require('thera-debug-common-types').Breakpoint
const {Emitter, Disposable} = require('atom')

module.exports =
class BreakpointModel {
  constructor (service, data) {
    this.breakpoints = data ? data.breakpoints : []

    this.emitter = new Emitter()
    this.disposable = new Disposable(service.onPaused(this._serviceHandler.bind(this)))
    this.service = service
    service.breakpoints = this.breakpoints
    this.selectedId = undefined
  }

  serialize () {
    return {breakpoints: this.breakpoints}
  }

  _serviceHandler (payload) {
    if (payload.command === COMMAND.RESOLVE_BREAKPOINT) {
      let breakpoint = payload.breakpoint
      let breakpointExist = this.getBreakpointsByPath(breakpoint.path, breakpoint.line)[0]

      if (!breakpointExist) {
        this.breakpoints.push(breakpoint)
        this.emitter.emit('did-change', {command: BreakpointModel.command().ADD, value: breakpoint})
      } else {
        breakpointExist.enable = breakpoint.enable
        this.emitter.emit('did-change', {command: BreakpointModel.command().ACTIVATE, value: breakpoint})
      }
      console.log(`resolve breakpoint ${JSON.stringify(breakpoint)}`)
    } else if (payload.command === COMMAND.REMOVE_BREAKPOINT) {
      this.removeBreakpointByPath(payload.path, payload.line, true)
    } else if (payload.command === COMMAND.DEBUGGER_STARTED) {
      // make a copy of breakpoints, make sure service cannot modify data
      this.service.syncAllBreakpoints(JSON.parse(JSON.stringify(this.breakpoints)))
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
    if (this.getBreakpointsByPath(file, line).length) {
      console.log(`discard duplicate breakpoint ${file}:${line}`)
    } else {
      let breakpoint = new Breakpoint(`${file}:${line}`, file, line, true)

      // cache breakpoint when debug not started
      this.breakpoints.push(breakpoint)
      this.service.setBreakpoint(file, line)
      this.emitter.emit('did-change', {command: BreakpointModel.command().ADD, value: breakpoint})
    }
  }

  // @param callByService mark calls from service, not to call back to service again.
  removeBreakpointByPath (path, line, callByService = false) {
    let breakpointRemain = this.breakpoints.filter((ele) => ele.path !== path || ele.line !== line)
    if (breakpointRemain.length !== this.breakpoints.length) {
      if (!callByService) {
        this.service.removeBreakpoint(path, line)
      }

      let breakpointsRemoved = this.breakpoints.filter((ele) => ele.path === path && ele.line === line)
      this.breakpoints = breakpointRemain
      this.emitter.emit('did-change', {command: BreakpointModel.command().REMOVE, value: breakpointsRemoved})
    }
  }

  setBreakpointActive (breakpoint, active) {
    let bpt = this.getBreakpointsByPath(breakpoint.path, breakpoint.line)[0]

    if (bpt) {
      bpt.enable = active
      this.emitter.emit('did-change', {command: BreakpointModel.command().ACTIVATE, value: bpt})
      this.service.setBreakpoint(breakpoint.path, breakpoint.line, active)
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
