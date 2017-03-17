'use strict'

const React = require('react')
const TreeView = require('./treeView')
const {Disposable} = require('atom')

module.exports =
class Scope extends React.Component {
  constructor (props) {
    super(props)

    let scopes = this.props.scopeModel.scopes
    let unfoldSet = new Set()

    // unfold first scope by default
    if (scopes.length > 0) {
      unfoldSet.add(scopes[0].type)
    }
    // scopes are tree of @type PropertyDescriptor
    this.state = {
      scopes: this.props.scopeModel.scopes,
      unfolds: unfoldSet
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
    let className
    if (this._isUnfold(scope.type)) {
      className = 'fa fa-arrow-down fa-fw'
    } else {
      className = 'fa fa-arrow-right fa-fw'
    }
    return (
      React.createElement("div", null, 
        React.createElement("i", {className: className, onClick: this._onFold.bind(this, scope)}), 
        React.createElement("label", null, scope.type), 
        this._isUnfold(scope.type) &&
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

  _onFold (scope) {
    let type = scope.type
    if (this._isUnfold(type)) {
      this.state.unfolds.delete(type)
    } else {
      this.state.unfolds.add(type)
    }
    this.setState({
      unfolds: this.state.unfolds
    })
  }

  _isUnfold (scopeType) {
    return this.state.unfolds.has(scopeType)
  }

  _onCheckLeaf (item) {
    return !item.value.hasChildren()
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
      result = this.props.provider.getProperties(scope.object.objectId)
    } else {
      result = this.props.provider.getProperties(item.value.objectId)
    }
    return result
  }
}