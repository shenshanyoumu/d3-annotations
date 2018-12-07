// each函数遍历当前节点所有后代节点
export default function() {
  var nodes = [];
  this.each(function(node) {
    nodes.push(node);
  });
  return nodes;
}
