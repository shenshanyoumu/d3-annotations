// parent节点的空间区域[x0,x1]表示左上角；[x1,y1]表示右上角。
// 下面表示从水平方向上切割矩形
export default function(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,

    // 将数值与空间建立映射关系
      k = parent.value && (x1 - x0) / parent.value;

  // 所有孩子节点的Y轴坐标与父节点一样，而X轴坐标按照value的比例关系计算
  while (++i < n) {
    node = nodes[i], node.y0 = y0, node.y1 = y1;
    node.x0 = x0, node.x1 = x0 += node.value * k;
  }
}
