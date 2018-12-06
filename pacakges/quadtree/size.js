// 递归计算四叉树节点数目
export default function() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length)
      do ++size;
      while ((node = node.next));
  });
  return size;
}
