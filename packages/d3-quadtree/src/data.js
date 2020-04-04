export default function() {
  var data = [];

  // 叶子节点上数据收集
  this.visit(function(node) {
    if (!node.length) do data.push(node.data); while (node = node.next)
  });
  return data;
}
