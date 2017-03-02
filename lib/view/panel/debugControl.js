'use babel'
'use strict'

const React = require('react')

class DebugControl extends React.Component {
  render () {
    return (
      React.createElement("div", null, 
        React.createElement("button", {onClick: (e) => this.resumeDebug(e)}, "continue"), 
        React.createElement("button", {onClick: (e) => this.stepOver(e)}, "step over"), 
        React.createElement("button", {onClick: (e) => this.stepInto(e)}, "step into"), 
        React.createElement("button", {onClick: (e) => this.stepOut(e)}, "step out"), 
        React.createElement("button", {onClick: (e) => this.stop(e)}, "stop")
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