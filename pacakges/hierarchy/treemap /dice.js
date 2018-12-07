// 根据parent节点，以及当前parent占据的图表区域来横向切割空间
export default function(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
    node,
    i = -1,
    n = nodes.length,
    // 节点的value是划分空间的度量标准
    k = parent.value && (x1 - x0) / parent.value;

  // parent的所有子节点根据各自的value占据parent的value的比例来划分空间
  while (++i < n) {
    (node = nodes[i]), (node.y0 = y0), (node.y1 = y1);
    (node.x0 = x0), (node.x1 = x0 += node.value * k);
  }
}
