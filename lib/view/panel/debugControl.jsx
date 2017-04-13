'use babel'
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
      <div className='thera-debug-control'>
        <button className={startStyle} onClick={(e) => this.resumeDebug(e)} title='continue' disabled={this.state.status === debugStatus.START}>
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
        <button className={stopStyle} onClick={(e) => this.stop(e)} title='stop' disabled={this.state.status === debugStatus.STOP}>
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
