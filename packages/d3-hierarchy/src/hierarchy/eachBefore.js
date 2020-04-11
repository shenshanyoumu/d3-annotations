
// 参数this表示hierarchy数据结构中某个元素Node
export default function(callback) {
  var node = this, nodes = [node], children, i;

  // 从上到下的逐层遍历，对每个节点对象调用Callback回调
  while (node = nodes.pop()) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
  return this;
}
