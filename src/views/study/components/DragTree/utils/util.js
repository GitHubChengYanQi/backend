let _treeId = 0

/**
 * 初始化树
 * @param {Array} tree 树的原始结构
 * @param {Object} props 树的字段值
 * @param {Boolean} defaultExpandAll 是否展开节点
 */
function initTree (tree, props, defaultExpandAll) {
  let right = localStorage.getItem('right')
  right = JSON.parse(right)
  return initTreed(tree, 1, props, defaultExpandAll, [], right)
}

/**
 * 初始化树
 * @param {Array} tree 树的原始结构
 * @param {Number} layer 层级
 * @param {Object} props 树的字段值
 * @param {Boolean} defaultExpandAll 是否展开节点
 * @param {Array} props 新树
 * @param {Array} right 判断节点展不展开
 */
function initTreed (tree, layer, props, defaultExpandAll, newTree, right) {
  for (let i = 0; i < tree.length; i++) {
    let obj = {}

    for (const item in tree[i]) {
      if (item === props.label) {
        obj.label = tree[i][item]
      } else if (item === props.id) {
        obj.id = tree[i][item]
      } else if (item === props.children && tree[i][props.children].length) {
        obj.children = []
      } else {
        obj[item] = tree[i][item]
        if (item === 'children') {
          delete obj.children
        }
      }
    }
    if (right) {
      right.indexOf(obj.id) !== -1 ? (obj.defaultExpandAll = true) : (obj.defaultExpandAll = false)
    } else {
      obj.defaultExpandAll = defaultExpandAll
    }

    obj._treeId = _treeId++
    obj.layer = layer
    obj.data = JSON.parse(JSON.stringify(tree[i]))
    newTree.push(obj)
    if ('children' in obj) {
      initTreed(
        tree[i][props.children],
        layer + 1,
        props,
        defaultExpandAll,
        newTree[i].children,
        right
      )
    }
    obj = {}
  }
  return newTree
}

/**
 *
 * @param {Array} tree 树
 * @param {Number} layer 层级
 * @returns
 */
function draggableTree (tree, layer) {
  for (let i = 0; i < tree.length; i++) {
    tree[i].layer = layer
    if ('children' in tree[i]) {
      draggableTree(tree[i].children, layer + 1)
    }
  }
  return tree
}

/**
 * 寻找
 */
function findNearestComponent (element, componentName) {
  let target = element
  while (target && target.tagName !== 'BODY') {
    if (target.__vue__ && target.__vue__.$options.name === componentName) {
      return target.__vue__
    }
    target = target.parentNode
  }
  return null
}

export {
  initTree,
  draggableTree,
  findNearestComponent
}
