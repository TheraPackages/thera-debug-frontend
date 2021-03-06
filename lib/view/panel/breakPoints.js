'use strict'

const React = require('react')
const BreakPointsElement = require('./breakpointElement')
const {CompositeDisposable} = require('atom')
const path = require('path')

module.exports =
class BreakPoints extends React.Component {
  constructor (props) {
    super(props)
    this.disposables = new CompositeDisposable()

    if (this.props.breakpoints) {
      this.state = {
        breakpoints: this.props.breakpoints.getBreakpoints(),
        selectedId: this.props.breakpoints.selectedId
      }
    } else {
      this.state = {}
    }

    this._onStatusChange = this._onStatusChange.bind(this)
    this._onSelect = this._onSelect.bind(this)
  }

  render () {
    const breakPointList = this.state.breakpoints ? this.state.breakpoints.sort((a, b) => {
      let indexA = path.basename(a.path) + a.line
      let indexB = path.basename(b.path) + b.line
      return indexA.localeCompare(indexB)
    })
    .map((breakpoint) =>
      React.createElement(BreakPointsElement, {
        key: this.makeKey(breakpoint), 
        breakpoint: breakpoint, 
        highlight: this.state.selectedId === breakpoint.id, 
        onStatusChange: this._onStatusChange, 
        onSelect: this._onSelect}
      )
    ) : undefined
    return (
      React.createElement("table", null, 
        React.createElement("tbody", null, 
          breakPointList
        )
      )
    )
  }

  _onStatusChange (breakpoint, active) {
    let breakpointModel = this.props.breakpoints
    breakpointModel.setBreakpointActive(breakpoint, active)
  }

  _highlightLine (editor, lineNumber) {
    // atom eidtor number should minus 1
    const marker = editor.markBufferRange(
      [[lineNumber, 0], [lineNumber, Infinity]],
      {invalidate: 'never'}
    )

    editor.decorateMarker(marker, {
      type: 'line',
      class: 'line-fadeout'
    })

    setTimeout(() => {
      marker.destroy()
    }, 1000)
  }

  _onSelect (breakpoint) {
    let id = breakpoint.id
    let path = breakpoint.path
    let actualLine = breakpoint.line - 1
    let breakpointModel = this.props.breakpoints
    breakpointModel.setSelectedId(id)

    // navigate to breakpoint
    let _this = this
    atom.workspace.open(path, {searchAllPanes: true}).then(editor => {
      editor.scrollToBufferPosition([actualLine, 0])
      editor.setCursorBufferPosition([actualLine, 0])
      _this._highlightLine(editor, actualLine)
    })
  }

  componentDidMount () {
    const breakpointModel = this.props.breakpoints
    let _this = this
    this.disposables.add(breakpointModel.observeBreakpoints(() => {
      _this.setState({
        breakpoints: breakpointModel.getBreakpoints(),
        selectedId: this.props.breakpoints.selectedId
      })
      _this.forceUpdate()
    }))
  }

  componentWillUnmount () {
    this.disposables.dispose()
  }

  makeKey (breakpoint) {
    return breakpoint.path + ':' + breakpoint.line
  }
}