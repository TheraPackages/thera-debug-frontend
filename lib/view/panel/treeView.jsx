'use strict'
'use babel'

const React = require('react')

//
// tree view component
// @root element tree to display
// @indent each line indent, in px
// @onRenderContent delegate to render content row, with paramter of content data
// @onGetNodes delegate to get nodes by parent
// @onCheckLeaf delegate to check whether a node is a leaf node
//
class TreeView extends React.Component {

  componentWillMount () {
    const _this = this
    this._loadNodes().then(
      (rootNode) => _this.setState({root: rootNode})
    )
  }

  // load one level a time
  _loadNodes (parent) {
    if (!this.props.onGetNodes) {
      return null
    }

    const parentItem = parent ? parent.item : undefined
    let result = this.props.onGetNodes(parentItem)

    // encapsule to a promise if not
    if (!result || !result.then) {
      result = Promise.resolve(result)
    }

    const _this = this
    return result.then((items) => _this._createNodes(items))
  }

  _createNodes (items) {
    const _this = this
    console.log(items)
    return items.map(item => {
      const leaf = _this.props.onCheckLeaf(item)
      const state = item.state || NodeState.COLLAPSED
      return {item: item, state: state, children: null, leaf: leaf}
    })
  }

  _createNodeView (nodes, level) {
    let list = []
    let _this = this
    nodes.forEach((ele) => {
      list.push(_this._createRow(ele, level + 1))
      if (ele.state !== NodeState.COLLAPSED && !ele.leaf && ele.children && ele.children.length > 0) {
        list.push(this._createNodeView(ele.children, level + 1))
      }
    })

    return list
  }

  _createRow (node, level) {
    const content = this.props.onRenderContent(node.item)
    const icon = this._resolveIcon(node)
    const nodeIcon = node.leaf ? icon
      : <a onClick={this._nodeClick.bind(this, node)}>
        {icon}
      </a>
    const nodeRow = (
      <div style={{marginLeft: level * this.props.indent + 'px'}}>
        {nodeIcon}
        {content}
      </div>
    )
    return nodeRow
  }

  _resolveIcon (node) {
    let icon

    if (node.leaf) {
      icon = this.props.iconLeaf
    } else {
      icon = node.state === NodeState.COLLAPSED ? this.props.iconCollapse : this.props.iconExpand
    }

    if (typeof icon === 'function') {
      icon = icon(node.item)
    }

    if (typeof icon === 'string') {
      var className = 'fa fa-' + icon + ' fa-fw'
      icon = <i className={className} />
    }

    return icon
  }

  _nodeClick (node, event) {
    if (node.state === NodeState.COLLAPSED) {
      this._expandNode(node)
    } else {
      this._collapseNode(node)
    }
  }

  _expandNode (node) {
    if (!node.children) {
      const _this = this
      this._loadNodes(node)
        .then((result) => {
          node.state = NodeState.EXPANDED
          node.children = result

          _this.forceUpdate()
        })
    } else {
      node.state = NodeState.EXPANDED
      this.forceUpdate()
    }
  }

  _collapseNode (node) {
    node.state = NodeState.COLLAPSED
    this.forceUpdate()
  }

  render () {
    if (this.state && this.state.root) {
      return (
        <div>
          {this._createNodeView(this.state.root, 0)}
        </div>
      )
    } else {
      return (
        <div>
          No element
        </div>
      )
    }
  }
}

TreeView.defaultProps = {
  indent: 16
}

const NodeState = Object.freeze({
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed'
})

module.exports = TreeView
