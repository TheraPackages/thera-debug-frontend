'use babel'
'use strict'

const React = require('react')
const path = require('path')

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
      <tr onClick={this._handleSelect}
        className={this.props.highlight ? 'selected' : ''}>
        <td title={this.props.calling.functionName}>
          {this.props.calling.functionName}
        </td>
        <td title={this.props.calling.fileURL}>
          {path.basename(this.props.calling.fileURL)}
        </td>
        <td>
          {location}
        </td>
      </tr>
    )
  }

  _handleSelect (e) {
    this.props.onClick(e, this.props.index, this.props.calling)
  }
}
