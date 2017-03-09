'use babel'
'use strict'

const React = require('react')
const CallStackElement = require('./callStackElement')
const {CompositeDisposable} = require('atom')

class CallStack extends React.Component {

  constructor (props) {
    super(props)
    this.disposables = new CompositeDisposable()
    this._handleSelect = this._handleSelect.bind(this)
    this.state = {
      selectedIndex: this.props.callstack.getSelectedIndex(),
      callstack: this.props.callstack.getCallStack()
    }
  }

  componentDidMount () {
    const callStackModel = this.props.callstack
    let _this = this
    this.disposables.add(callStackModel.onChange(() => {
      _this.setState({
        selectedIndex: callStackModel.getSelectedIndex(),
        callstack: callStackModel.getCallStack()
      })
    }))
  }

  componentWillUnmount () {
    this.disposables.dispose()
  }

  _handleSelect (e, index, calling) {
    console.log(e)
    this.props.provider.selectCallFrame(calling.callFrameId)
  }

  render () {
    var _this = this
    const stackList = this.state.callstack ? this.state.callstack.map((calling, i) =>
      <CallStackElement
        calling={calling}
        index={i}
        onClick={_this._handleSelect}
        highlight={_this.state.selectedIndex === i}
      />
    ) : undefined

    return (
      <div>
        {stackList}
      </div>
    )
  }

  // makeKey (calling) {
  //   return calling.fileURL + ':' + (typeof calling.location === 'object' ? calling.location.lineNumber : calling.location)
  // }
}

module.exports = CallStack
