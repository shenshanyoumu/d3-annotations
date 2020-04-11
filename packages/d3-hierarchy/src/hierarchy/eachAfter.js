// 
export default function(callback) {
  var node = this, nodes = [node], next = [], children, i, n;

  // 先从上到下逐层遍历，把节点push到next数组。
  while (node = nodes.pop()) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }

  // 相当于从下到上的逐层遍历，并调用回调函数
  while (node = next.pop()) {
    callback(node);
  }
  return this;
}
