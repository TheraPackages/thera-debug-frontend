'use strict'
'use babel'

const React = require('react')
const ReactDOM = require('react-dom')
const $ = require('jquery')
const serviceProvider = require('../../service/serviceProvider')
const DebugControl = require('./debugControl')
const CallStack = require('./callStack')
const Scope = require('./scope')
const BreakPoints = require('./breakPoints')
const Collapse = require('rc-collapse')
const Panel = require('rc-collapse').Panel
var debugModel = require('../../model/debugModel')

class DebugPanel extends React.Component {
  render () {
    return (
      <div>
        <Collapse defaultActiveKey={['debugControl', 'callStack', 'scope', 'breakpoint']}>
          <Panel header='Debug Control' className='debug-section-header' key='debugControl'>
            <DebugControl provider={this.props.provider} />
          </Panel>
          <Panel header='Call Stack' className='debug-section-header' key='callStack'>
            <CallStack callstack={this.props.model.callStackModel} provider={this.props.provider} />
          </Panel>
          <Panel header='Scope' className='debug-section-header' key='scope'>
            <Scope />
          </Panel>
          <Panel header='Break Points' className='debug-section-header' key='breakpoint'>
            <BreakPoints breakpoints={this.props.model.breakpointModel} provider={this.props.provider} />
          </Panel>
        </Collapse>
      </div>
    )
  }
}

var show = function () {
  var root = $('#symbols-tabs-debug').get(0)
  ReactDOM.render(
    React.createElement(DebugPanel, {model: debugModel, provider: serviceProvider.currentProvider()}),
    $('#symbols-tabs-debug').get(0)
  )
  $(root).show()
}

var hide = function () {
  var root = $('#symbols-tabs-debug').get(0)
  $(root).hide()
}

module.exports = {
  show: show,
  hide: hide
}
