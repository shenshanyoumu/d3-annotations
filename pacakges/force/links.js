import constant from "./constant.js";
import jiggle from "./jiggle.js";

//仿真过程可以有多种力学效应构成，比如centering中心聚集力学-类似吸铁
// collision碰撞力学
// ManyBody多力学单位的组合
// positioning在固定位置上的振荡力学
function index(d) {
  return d.index;
}

function find(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node) throw new Error("missing: " + nodeId);
  return node;
}

//links数组每个元素都是一个对象，其拓扑结构表示力导向图的连接关系
// 而每个link的力学效果类似弹性绳
export default function(links) {
  var id = index,
    strength = defaultStrength,
    strengths,
    distance = constant(30),
    distances,
    nodes,
    count,
    bias,
    iterations = 1;

  if (links == null) links = [];

  function defaultStrength(link) {
    return 1 / Math.min(count[link.source.index], count[link.target.index]);
  }

  function force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
        (link = links[i]), (source = link.source), (target = link.target);
        x = target.x + target.vx - source.x - source.vx || jiggle();
        y = target.y + target.vy - source.y - source.vy || jiggle();
        l = Math.sqrt(x * x + y * y);
        l = ((l - distances[i]) / l) * alpha * strengths[i];
        (x *= l), (y *= l);
        target.vx -= x * (b = bias[i]);
        target.vy -= y * b;
        source.vx += x * (b = 1 - b);
        source.vy += y * b;
      }
    }
  }

  function initialize() {
    if (!nodes) return;

    var i,
      n = nodes.length,
      m = links.length,
      nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d])),
      link;

    for (i = 0, count = new Array(n); i < m; ++i) {
      (link = links[i]), (link.index = i);
      if (typeof link.source !== "object")
        link.source = find(nodeById, link.source);
      if (typeof link.target !== "object")
        link.target = find(nodeById, link.target);
      count[link.source.index] = (count[link.source.index] || 0) + 1;
      count[link.target.index] = (count[link.target.index] || 0) + 1;
    }

    for (i = 0, bias = new Array(m); i < m; ++i) {
      (link = links[i]),
        (bias[i] =
          count[link.source.index] /
          (count[link.source.index] + count[link.target.index]));
    }

    (strengths = new Array(m)), initializeStrength();
    (distances = new Array(m)), initializeDistance();
  }

  function initializeStrength() {
    if (!nodes) return;

    for (var i = 0, n = links.length; i < n; ++i) {
      strengths[i] = +strength(links[i], i, links);
    }
  }

  function initializeDistance() {
    if (!nodes) return;

    for (var i = 0, n = links.length; i < n; ++i) {
      distances[i] = +distance(links[i], i, links);
    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.links = function(_) {
    return arguments.length ? ((links = _), initialize(), force) : links;
  };

  force.id = function(_) {
    return arguments.length ? ((id = _), force) : id;
  };

  force.iterations = function(_) {
    return arguments.length ? ((iterations = +_), force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length
      ? ((strength = typeof _ === "function" ? _ : constant(+_)),
        initializeStrength(),
        force)
      : strength;
  };

  force.distance = function(_) {
    return arguments.length
      ? ((distance = typeof _ === "function" ? _ : constant(+_)),
        initializeDistance(),
        force)
      : distance;
  };

  return force;
}
