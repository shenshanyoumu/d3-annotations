// 四叉树所有叶子节点数目。对于叶子节点node.length为undefined
export default function() {
  var size = 0;
  this.visit(function(node) {
    // 四叉树内部节点具有四个子节点，node.next计算叶子节点上datum数据
    if (!node.length) do ++size; while (node = node.next)
  });
  return size;
}
