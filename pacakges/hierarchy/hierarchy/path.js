export default function(end) {
  var start = this,
    ancestor = leastCommonAncestor(start, end),
    nodes = [start];
  while (start !== ancestor) {
    start = start.parent;
    nodes.push(start);
  }
  var k = nodes.length;
  while (end !== ancestor) {
    nodes.splice(k, 0, end);
    end = end.parent;
  }
  return nodes;
}

//
function leastCommonAncestor(a, b) {
  if (a === b) return a;

  // 计算a/b节点各自的祖先节点集
  var aNodes = a.ancestors(),
    bNodes = b.ancestors(),
    c = null;

  // 根据ancestors方法实现，aNodes数组中第一个节点为树的根节点，而最后一个节点为当前节点的父节点
  a = aNodes.pop();
  b = bNodes.pop();

  // 显然一个树上任意两个节点最古老的祖先节点为根节点，而下面的方法就是寻找两个节点最近的祖先节点，从而形成最短路径
  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }
  return c;
}
