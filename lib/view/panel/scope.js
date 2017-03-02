'use babel'
'use strict'

const React = require('react')

module.exports =
class Scope extends React.Component {
  render () {
    return (
      React.createElement("p", null)
      // <p className='debug-section-header'>Scope</p>
    )
  }
}