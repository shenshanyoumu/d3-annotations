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

// 两个节点最近祖先节点
function leastCommonAncestor(a, b) {
  if (a === b) return a;

  // 分别计算a、b节点的祖先节点列表。
  // 注意节点列表最右边元素为root节点，最左边节点为当前节点父亲节点
  var aNodes = a.ancestors(),
      bNodes = b.ancestors(),
      c = null;
  
  // 从root祖先开始对比，直到出现分叉
  a = aNodes.pop();
  b = bNodes.pop();
  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }
  return c;
}
