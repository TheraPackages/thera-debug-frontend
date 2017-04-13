'use strict'

const React = require('react')
const {CompositeDisposable} = require('atom')
const {debugStatus, debugControlService} = require('../../service/debugControlService')

class DebugControl extends React.Component {

  constructor (props) {
    super(props)
    this.disposables = new CompositeDisposable()

    this.state = {
      status: debugControlService.status
    }
  }

  componentDidMount () {
    const _this = this
    this.disposables.add(debugControlService.onChange(() => {
      _this.setState({
        status: debugControlService.status
      })
    }))
  }

  componentWillUnmount () {
    this.disposables.dispose()
  }

  render () {
    const startStyle = this.state.status === debugStatus.PAUSE ? 'btn green' : 'btn'
    const stopStyle = this.state.status === debugStatus.STOP ? 'btn' : 'btn red'
    return (
      React.createElement("div", {className: "thera-debug-control"}, 
        React.createElement("button", {className: startStyle, onClick: (e) => this.resumeDebug(e), title: "continue", disabled: this.state.status === debugStatus.START}, 
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
        React.createElement("button", {className: stopStyle, onClick: (e) => this.stop(e), title: "stop", disabled: this.state.status === debugStatus.STOP}, 
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