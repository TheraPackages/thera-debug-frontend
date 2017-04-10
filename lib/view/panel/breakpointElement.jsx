'use strict'
'use babel'

const React = require('react')
const Checkbox = require('rc-checkbox')
const path = require('path')

module.exports =
class BreakPointsElement extends React.Component {
  constructor (props) {
    super(props)
    this._handleStatusChange = this._handleStatusChange.bind(this)
    this._handleSelect = this._handleSelect.bind(this)
  }

  render () {
    return (
      <p onClick={this._handleSelect}
        className='call-stack-element'>
        <Checkbox checked={this.props.breakpoint.enable ? 1 : 0}
          onChange={this._handleStatusChange}
        />
        <label className='call-stack-file-and-line-highlight'>
          {this._labelContent()}
        </label>
      </p>
    )
  }

  _handleSelect (e) {
    this.props.onSelect(this.props.breakpoint)
  }

  _handleStatusChange (e, checked) {
    // checked is original status
    this.props.onStatusChange(this.props.breakpoint, !this.props.breakpoint.enable)
  }

  _labelContent () {
    return path.basename(this.props.breakpoint.path) + ':' + this.props.breakpoint.line
  }
}
