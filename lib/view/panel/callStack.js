'use strict'

const React = require('react')
const CallStackElement = require('./callStackElement')
const {CompositeDisposable} = require('atom')

class CallStack extends React.Component {

  constructor (props) {
    super(props)
    this.disposables = new CompositeDisposable()
    this._handleSelect = this._handleSelect.bind(this)

    if (this.props.callstack) {
      this.state = {
        selectedIndex: this.props.callstack.getSelectedIndex(),
        callstack: this.props.callstack.getCallStack()
      }
    } else {
      this.state = {}
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
      React.createElement(CallStackElement, {
        calling: calling, 
        index: i, 
        onClick: _this._handleSelect, 
        highlight: _this.state.selectedIndex === i}
      )
    ) : undefined

    let head
    if (stackList && stackList.length > 0) {
      head =
        React.createElement("thead", null, 
          React.createElement("th", null, "function"), 
          React.createElement("th", null, "script"), 
          React.createElement("th", null, "line")
        )
    }

    return (
      React.createElement("table", {className: "table-callstack"}, 
        head, 
        React.createElement("tbody", {className: "callstack-body"}, 
          stackList
        )

      )
    )
  }
}

module.exports = CallStack