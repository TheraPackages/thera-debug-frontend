'use babel'
'use strict'

const React = require('react')
const Collapse = require('rc-collapse')
const Panel = require('rc-collapse').Panel

module.exports =
class Scope extends React.Component {

  render () {
    return (
      <div>
        {/* <Collapse defaultActiveKey={['debugControl', 'callStack', 'scope', 'breakpoint']}>
          <Panel header='Debug Control' className='debug-section-header' key='debugControl'>
            <DebugControl provider={this.props.provider} />
          </Panel>
        </Collapse> */}
      </div>
    )
  }
}
