// Thunk形式返回参数本身
import constant from "./constant.js";

export default function(x) {
  var strength = constant(0.1),
    nodes,
    strengths,
    xz;

  // 下面代码在D3很常见，用于将非函数参数封装为函数
  if (typeof x !== "function") {
    x = constant(x == null ? 0 : +x);
  }

  // 下面为verlet积分的实现部分，主要是得到节点连线在X轴上的受力
  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      (node = nodes[i]), (node.vx += (xz[i] - node.x) * strengths[i] * alpha);
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
      n = nodes.length;
    strengths = new Array(n);
    xz = new Array(n);

    // 节点之间强度值，由于在仿真时运动调整
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN((xz[i] = +x(nodes[i], i, nodes)))
        ? 0
        : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.strength = function(_) {
    return arguments.length
      ? ((strength = typeof _ === "function" ? _ : constant(+_)),
        initialize(),
        force)
      : strength;
  };

  force.x = function(_) {
    return arguments.length
      ? ((x = typeof _ === "function" ? _ : constant(+_)), initialize(), force)
      : x;
  };

  return force;
}
