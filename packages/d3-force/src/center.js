
// centering方式的力导向布局，最终的平衡态是所有节点的坐标分量均值为[x,y]节点
export default function(x, y) {
  var nodes;

  if (x == null) x = 0;
  if (y == null) y = 0;

  function force() {
    var i,
        n = nodes.length,
        node,
        sx = 0,
        sy = 0;

        // 计算节点系统的坐标中心，则很朴素算法即可
    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x, sy += node.y;
    }

    // 根据centering聚合，重新计算得到每个节点的坐标。
    // 下面sx/n用于将所有节点的坐标X分量之和进行分摊
    for (sx = sx / n - x, sy = sy / n - y, i = 0; i < n; ++i) {
      node = nodes[i], node.x -= sx, node.y -= sy;
    }
  }

  // 初始化节点集，node对象包括位置坐标和速度向量
  force.initialize = function(_) {
    nodes = _;
  };

  force.x = function(_) {
    return arguments.length ? (x = +_, force) : x;
  };

  force.y = function(_) {
    return arguments.length ? (y = +_, force) : y;
  };

  return force;
}
