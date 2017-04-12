'use babel'
'use strict'

const React = require('react')

class DebugControl extends React.Component {
  render () {
    return (
      <div className='thera-debug-control'>
        <button className='btn' onClick={(e) => this.resumeDebug(e)} title='continue'>
          <i className='fa fa-eject' aria-hidden='true' />
        </button>
        <button className='btn' onClick={(e) => this.stepOver(e)} title='step over'>
          <i className='fa fa-arrow-right' aria-hidden='true' />
        </button>
        <button className='btn' onClick={(e) => this.stepInto(e)} title='step into'>
          <i className='fa fa-arrow-down' aria-hidden='true' />
        </button>
        <button className='btn' onClick={(e) => this.stepOut(e)} title='step out'>
          <i className='fa fa-arrow-up' aria-hidden='true' />
        </button>
        <button className='btn' onClick={(e) => this.stop(e)} title='stop'>
          <i className='fa fa-stop' aria-hidden='true' />
        </button>
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
