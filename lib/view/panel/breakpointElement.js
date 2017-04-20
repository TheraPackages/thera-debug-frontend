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
      React.createElement("tr", {onClick: this._handleSelect, 
        className: "breakpoint-element"}, 
        React.createElement("td", null, 
          React.createElement(Checkbox, {checked: this.props.breakpoint.enable ? 1 : 0, 
            onChange: this._handleStatusChange}
          ), 
          React.createElement("label", {"data-title": this.props.breakpoint.path}, 
            path.basename(this.props.breakpoint.path)
          )
        ), 
        React.createElement("td", null, 
          React.createElement("label", null, 
            this.props.breakpoint.line
          )
        )
      )
    )
  }

  _handleSelect (e) {
    this.props.onSelect(this.props.breakpoint)
  }

  _handleStatusChange (e, checked) {
    // checked is original status
    this.props.onStatusChange(this.props.breakpoint, !this.props.breakpoint.enable)
  }

  // _labelContent () {
  //   return path.basename(this.props.breakpoint.path) + ':' + this.props.breakpoint.line
  // }
}