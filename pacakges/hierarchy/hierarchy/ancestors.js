// 找到当前节点所有祖先节点
export default function() {
  var node = this,
    nodes = [node];
  while ((node = node.parent)) {
    nodes.push(node);
  }
  return nodes;
}
