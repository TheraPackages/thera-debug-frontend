'use strict'

const React = require('react')

class DebugControl extends React.Component {
  render () {
    return (
      React.createElement("div", {className: "thera-debug-control"}, 
        React.createElement("button", {className: "btn", onClick: (e) => this.resumeDebug(e), title: "continue"}, 
          React.createElement("i", {className: "fa fa-eject", "aria-hidden": "true"})
        ), 
        React.createElement("button", {className: "btn", onClick: (e) => this.stepOver(e), title: "step over"}, 
          React.createElement("i", {className: "fa fa-arrow-right", "aria-hidden": "true"})
        ), 
        React.createElement("button", {className: "btn", onClick: (e) => this.stepInto(e), title: "step into"}, 
          React.createElement("i", {className: "fa fa-arrow-down", "aria-hidden": "true"})
        ), 
        React.createElement("button", {className: "btn", onClick: (e) => this.stepOut(e), title: "step out"}, 
          React.createElement("i", {className: "fa fa-arrow-up", "aria-hidden": "true"})
        ), 
        React.createElement("button", {className: "btn", onClick: (e) => this.stop(e), title: "stop"}, 
          React.createElement("i", {className: "fa fa-stop", "aria-hidden": "true"})
        )
      )
    )
  }

  resumeDebug (e) {
    this.props.provider.resume()
  }

  stepOver (e) {
    this.props.provider.stepOver()
  }

  stepInto (e) {
    this.props.provider.stepInto()
  }

  stepOut (e) {
    this.props.provider.stepOut()
  }

  stop (e) {
    this.props.provider.stopDebug()
  }
}

module.exports = DebugControl