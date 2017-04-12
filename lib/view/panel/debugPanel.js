'use babel'

const React = require('react')
const ReactDOM = require('react-dom')
const $ = require('jquery')
const serviceProvider = require('../../service/serviceProvider')
const DebugControl = require('./debugControl')
const CallStack = require('./callStack')
const Scope = require('./scope')
const BreakPoints = require('./breakPoints')
const Collapse = require('rc-collapse')
const Panel = require('rc-collapse').Panel
var debugModel = require('../../model/debugModel')

class DebugPanel extends React.Component {
  render () {
    return (
      React.createElement("div", null, 
        React.createElement(DebugControl, {provider: this.props.provider}), 
        React.createElement(Collapse, {defaultActiveKey: ['callStack', 'scope', 'breakpoint']}, 
          React.createElement(Panel, {header: "Call Stack", className: "debug-section-header", key: "callStack"}, 
            React.createElement(CallStack, {callstack: this.props.model.callStackModel, provider: this.props.provider})
          ), 
          React.createElement(Panel, {header: "Scope", className: "debug-section-header", key: "scope"}, 
            React.createElement(Scope, {scopeModel: this.props.model.scopeModel, provider: this.props.provider})
          ), 
          React.createElement(Panel, {header: "Break Points", className: "debug-section-header", key: "breakpoint"}, 
            React.createElement(BreakPoints, {breakpoints: this.props.model.breakpointModel, provider: this.props.provider})
          )
        )
      )
    )
  }
}

var show = function () {
  var root = $('#symbols-tabs-debug').get(0)
  ReactDOM.render(
    React.createElement(DebugPanel, {model: debugModel, provider: serviceProvider.currentProvider()}),
    $('#symbols-tabs-debug').get(0)
  )
  $(root).show()
}

var hide = function () {
  var root = $('#symbols-tabs-debug').get(0)
  $(root).hide()
}

module.exports = {
  show: show,
  hide: hide
}