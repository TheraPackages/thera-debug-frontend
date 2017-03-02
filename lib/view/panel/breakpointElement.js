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
      React.createElement("p", {onClick: this._handleSelect, 
        className: "call-stack-element"}, 
        React.createElement(Checkbox, {checked: this.props.breakpoint.enable ? 1 : 0, 
          onChange: this._handleStatusChange}
        ), 
        React.createElement("label", {className: "call-stack-file-and-line-highlight"}, 
          this._labelContent()
        )
      )
    )
  }

  _handleSelect (e) {
    this.props.onSelect(this.props.breakpoint)
  }

  _handleStatusChange (e, checked) {
    // checked is original status
    this.props.onStatusChange(this.props.breakpoint.id, !this.props.breakpoint.enable)
  }

  _labelContent () {
    return path.basename(this.props.breakpoint.path) + ':' + this.props.breakpoint.line
  }
}