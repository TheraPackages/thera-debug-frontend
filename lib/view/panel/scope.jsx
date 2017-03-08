'use babel'
'use strict'

const React = require('react')
const TreeView = require('./treeView')
const {Disposable} = require('atom')

module.exports =
class Scope extends React.Component {
  constructor (props) {
    super(props)

    // scopes are tree of @type PropertyDescriptor
    this.state = {
      scopes: this.props.scopeModel.scopes
    }
  }

  componentDidMount () {
    const _this = this
    this.disposable = new Disposable(this.props.scopeModel.onChange(() => {
      _this.setState({
        scopes: this.props.scopeModel.scopes
      })
    }))
  }

  render () {
    let list = []
    const _this = this
    this.state.scopes.map((scope) => {
      list.push(_this._createSection(scope))
    })

    return <div>{list}</div>
  }

  _createSection (scope) {
    return (
      <div>
        <i className='fa fa-arrow-down fa-fw' />
        <label>{scope.type}</label>
        <TreeView
          onGetNodes={this._onGetNodes.bind(this, scope)}
          onRenderContent={this._onRenderContent.bind(this)}
          onCheckLeaf={this._onCheckLeaf.bind(this)}
          iconExpand='arrow-down'
          iconCollapse='arrow-right'
        />
      </div>
    )
  }

  _onCheckLeaf (item) {
    return !item.value.hasChildren
  }

  _onRenderContent (item) {
    let value
    if (item.value.isPrimitive()) {
      value = item.value.value
    } else {
      value = item.value.className
    }
    return <em>
      <label className='scope-label'>{item.name}</label>
      <label>: {value}</label>
    </em>
  }

  _onGetNodes (scope, item) {
    let result
    if (!item) {
      result = this.props.provider.getProperties(scope.object.id)
    } else {
      result = this.props.provider.getProperties(item.value.id)
    }
    return result
  }
}
