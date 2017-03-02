'use babel'
'use strict'

const React = require('react')

class DebugControl extends React.Component {
  render () {
    return (
      <div>
        <button onClick={(e) => this.resumeDebug(e)}>continue</button>
        <button onClick={(e) => this.stepOver(e)}>step over</button>
        <button onClick={(e) => this.stepInto(e)}>step into</button>
        <button onClick={(e) => this.stepOut(e)}>step out</button>
        <button onClick={(e) => this.stop(e)}>stop</button>
      </div>
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
