'use babel'
'use strict'

const React = require('react')

module.exports =
class CallStackElement extends React.Component {
  constructor (props) {
    super(props)
    this._handleSelect = this._handleSelect.bind(this)
  }

  render () {
    return (
      <p onClick={this._handleSelect}
        className={this.props.highlight ? 'call-stack-element-highlight' : 'call-stack-element'}>
        <label className={this.props.highlight ? 'call-stack-method-highlight' : 'call-stack-method'}>
          {this.props.calling.functionName}
        </label>
        <label className={this.props.highlight
          ? 'call-stack-file-and-line-highlight' : 'call-stack-file-and-line'}>
          {this.props.calling.fileURL}:{this.props.calling.location}
        </label>
      </p>
    )
  }

  _handleSelect (e) {
    this.props.onClick(e, this.props.index, this.props.calling)
  }
}