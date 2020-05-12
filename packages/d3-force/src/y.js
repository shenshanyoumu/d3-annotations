import constant from "./constant";

export default function(y) {
  var strength = constant(0.1),
      nodes,
      strengths,
      yz;

  if (typeof y !== "function") y = constant(y == null ? 0 : +y);

  // node.vy即节点的velocity速度向量的Y分量。strength和alpha都用于控制速度的变化
  // 其实可以理解，整个运动学中速度和位置是最关键的指标，其他指标都转换为这两个指标
  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], 
        node.vy += (yz[i] - node.y) * strengths[i] * alpha;
    }
  }

  function initialize() {
    // 系统中不存在刚体节点，则直接返回
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    yz = new Array(n);

    // 强度strength因子，作用于刚体的速度向量上
    // 相当于在刚体增加一个引力或者斥力
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : 
      +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  // 根据readme，strength作用于刚体的速度向量上，一般用于对存在重叠的刚体进行
  // "散开"操作，从而让整个系统处于稳定状态
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  // 注意下面"+_"用于将数字字符串转换为数值型
  force.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
  };

  return force;
}
