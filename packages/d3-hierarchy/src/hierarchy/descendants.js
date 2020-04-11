// 得到当前this节点，及其所有后代节点组成的节点集合
export default function() {
  var nodes = [];
  this.each(function(node) {
    nodes.push(node);
  });
  return nodes;
}
