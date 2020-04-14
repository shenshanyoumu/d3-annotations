// 矩形区域的坐标点舍入处理，保持整数
import roundNode from "./treemap/round.js";

// 按比例对矩形进行垂直方向切割X坐标
import treemapDice from "./treemap/dice.js";

export default function() {
  var dx = 1,
      dy = 1,
      padding = 0,
      round = false;

  function partition(root) {
    // height相对于叶子节点
    var n = root.height + 1;
    root.x0 =
    root.y0 = padding;
    root.x1 = dx;
    root.y1 = dy / n;

    // 从上到下逐层迭代，计算空间划分中每个节点的坐标
    root.eachBefore(positionNode(dy, n));

    // 如果需要对矩形坐标进行取整处理，则调用
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(dy, n) {
    return function(node) {

      // 如果存在孩子节点，则对节点node的空间区域进行垂直方向切割X轴
      if (node.children) {
        treemapDice(node, node.x0, dy * (node.depth + 1) / n, 
        node.x1, dy * (node.depth + 2) / n);
      }

      
      var x0 = node.x0,
          y0 = node.y0,
          x1 = node.x1 - padding,
          y1 = node.y1 - padding;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
    };
  }

  // 表示是否对矩形的坐标点进行舍入取整
  partition.round = function(x) {
    return arguments.length ? (round = !!x, partition) : round;
  };

  partition.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
  };

  // padding用于隔离节点的邻接孩子节点
  partition.padding = function(x) {
    return arguments.length ? (padding = +x, partition) : padding;
  };

  return partition;
}
