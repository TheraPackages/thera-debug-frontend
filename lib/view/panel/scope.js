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

    return React.createElement("div", null, list)
  }

  _createSection (scope) {
    return (
      React.createElement("div", null, 
        React.createElement("i", {className: "fa fa-arrow-down fa-fw"}), 
        React.createElement("label", null, scope.type), 
        React.createElement(TreeView, {
          onGetNodes: this._onGetNodes.bind(this, scope), 
          onRenderContent: this._onRenderContent.bind(this), 
          onCheckLeaf: this._onCheckLeaf.bind(this), 
          iconExpand: "arrow-down", 
          iconCollapse: "arrow-right"}
        )
      )
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
    return React.createElement("em", null, 
      React.createElement("label", {className: "scope-label"}, item.name), 
      React.createElement("label", null, ": ", value)
    )
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