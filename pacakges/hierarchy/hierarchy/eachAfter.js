// 对this节点所有后代节点进行后序遍历
export default function(callback) {
  var node = this,
    nodes = [node],
    next = [],
    children,
    i,
    n;

  // next数组存储的节点顺序按照后序存储
  while ((node = nodes.pop())) {
    next.push(node), (children = node.children);
    if (children)
      for (i = 0, n = children.length; i < n; ++i) {
        nodes.push(children[i]);
      }
  }

  // next数组中第一个元素才是this节点，因此最后被访问
  while ((node = next.pop())) {
    callback(node);
  }
  return this;
}
