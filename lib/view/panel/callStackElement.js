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
    let location = this.props.calling.location
    location = typeof location === 'object' ? location.lineNumber : location
    return (
      React.createElement("p", {onClick: this._handleSelect, 
        className: this.props.highlight ? 'call-stack-element-highlight' : 'call-stack-element'}, 
        React.createElement("label", {className: this.props.highlight ? 'call-stack-method-highlight' : 'call-stack-method'}, 
          this.props.calling.functionName
        ), 
        React.createElement("label", {className: this.props.highlight
          ? 'call-stack-file-and-line-highlight' : 'call-stack-file-and-line'}, 
          this.props.calling.fileURL, ":", location
        )
      )
    )
  }

  _handleSelect (e) {
    this.props.onClick(e, this.props.index, this.props.calling)
  }
}