import { ascending, min, sum } from "d3-array";
import { map, nest } from "d3-collection";
import { justify } from "./align";
import constant from "./constant";

/**
 * 按照两个Link的source节点在垂直方向的上沿坐标升序
 * @param {*} a 表示Link a
 * @param {*} b 表示Link b
 */
function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

/**
 * 按照两个Link的target节点在垂直方向的上沿坐标升序
 * @param {*} a 表示Link a
 * @param {*} b 表示Link b
 */
function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

// 比较两个节点在垂直方向上的上沿坐标大小
function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

// 节点的value也等于所有输出的Link的value之和
function value(d) {
  return d.value;
}

// 默认情况下，桑基图的节点是一个矩形框，因此具有上下沿高度信息
// 为了优化Link与节点的连接，需要计算节点在垂直方向上的中心点坐标
function nodeCenter(node) {
  return (node.y0 + node.y1) / 2;
}

//主要用于关联Link的源节点/目标节点的垂直方向坐标和Link本身的流量值
//用于美化图表展示
function weightedSource(link) {
  return nodeCenter(link.source) * link.value;
}

function weightedTarget(link) {
  return nodeCenter(link.target) * link.value;
}

//默认ID访问器，返回节点/Link在数组中的索引值
function defaultId(d) {
  return d.index;
}

// 节点生成器
function defaultNodes(graph) {
  return graph.nodes;
}

// 连线生成器
function defaultLinks(graph) {
  return graph.links;
}

/**
 * 在保存节点的map结构中根据给定的节点Id返回对应的节点
 * @param {*} nodeById 一般为Map结构
 * @param {*} id 当前节点的id
 */
function find(nodeById, id) {
  var node = nodeById.get(id);
  if (!node) {
    throw new Error("missing: " + id);
  }
  return node;
}

export default function() {
  // x0/x1/y0/y1四个变量决定了当前桑基图在DOM容器中的布局范围，默认为充满整个DOM容器
  var x0 = 0,
    y0 = 0,
    x1 = 1,
    y1 = 1, // extent
    dx = 24, // 每个节点矩形的宽度
    py = 8, // 每个节点矩形在垂直方向上的padding值
    id = defaultId,
    align = justify,
    nodes = defaultNodes,
    links = defaultLinks,
    iterations = 32; //计算节点/Link布局的迭代次数

  function sankey() {
    // 所有网络图都是有节点与连线构成
    var graph = {
      nodes: nodes.apply(null, arguments),
      links: links.apply(null, arguments)
    };
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeBreadths(graph, iterations);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  // 节点的ID访问器，默认为节点在节点数组中的索引值
  sankey.nodeId = function(_) {
    return arguments.length
      ? ((id = typeof _ === "function" ? _ : constant(_)), sankey)
      : id;
  };

  // 桑基图中节点需要水平布局，可以经过调整使得图表中节点靠左/靠右聚集
  sankey.nodeAlign = function(_) {
    return arguments.length
      ? ((align = typeof _ === "function" ? _ : constant(_)), sankey)
      : align;
  };

  // 由于节点矩形居于宽度，因此需要设置，默认为24像素
  sankey.nodeWidth = function(_) {
    return arguments.length ? ((dx = +_), sankey) : dx;
  };

  // 设置节点矩形在垂直方向上的padding值，避免垂直方向上两个节点太靠近
  sankey.nodePadding = function(_) {
    return arguments.length ? ((py = +_), sankey) : py;
  };

  // 桑基图的Nodes属性
  sankey.nodes = function(_) {
    return arguments.length
      ? ((nodes = typeof _ === "function" ? _ : constant(_)), sankey)
      : nodes;
  };

  sankey.links = function(_) {
    return arguments.length
      ? ((links = typeof _ === "function" ? _ : constant(_)), sankey)
      : links;
  };

  sankey.size = function(_) {
    return arguments.length
      ? ((x0 = y0 = 0), (x1 = +_[0]), (y1 = +_[1]), sankey)
      : [x1 - x0, y1 - y0];
  };

  sankey.extent = function(_) {
    return arguments.length
      ? ((x0 = +_[0][0]),
        (x1 = +_[1][0]),
        (y0 = +_[0][1]),
        (y1 = +_[1][1]),
        sankey)
      : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function(_) {
    return arguments.length ? ((iterations = +_), sankey) : iterations;
  };

  /**
   *
   * @param {*} graph 包含Nodes和Links的图结构
   */
  function computeNodeLinks(graph) {
    graph.nodes.forEach(function(node, i) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    // 注意map结构在d3-collection的实现
    var nodeById = map(graph.nodes, id);
    graph.links.forEach(function(link, i) {
      link.index = i;
      var source = link.source,
        target = link.target;
      if (typeof source !== "object")
        source = link.source = find(nodeById, source);
      if (typeof target !== "object")
        target = link.target = find(nodeById, target);
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues(graph) {
    graph.nodes.forEach(function(node) {
      node.value = Math.max(
        sum(node.sourceLinks, value),
        sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the depth (x-position) for each node.
  // Nodes are assigned the maximum depth of incoming neighbors plus one;
  // nodes with no incoming links are assigned depth zero, while
  // nodes with no outgoing links are assigned the maximum depth.
  function computeNodeDepths(graph) {
    var nodes, next, x;

    for (
      nodes = graph.nodes, next = [], x = 0;
      nodes.length;
      ++x, nodes = next, next = []
    ) {
      nodes.forEach(function(node) {
        node.depth = x;
        node.sourceLinks.forEach(function(link) {
          if (next.indexOf(link.target) < 0) {
            next.push(link.target);
          }
        });
      });
    }

    for (
      nodes = graph.nodes, next = [], x = 0;
      nodes.length;
      ++x, nodes = next, next = []
    ) {
      nodes.forEach(function(node) {
        node.height = x;
        node.targetLinks.forEach(function(link) {
          if (next.indexOf(link.source) < 0) {
            next.push(link.source);
          }
        });
      });
    }

    var kx = (x1 - x0 - dx) / (x - 1);
    graph.nodes.forEach(function(node) {
      node.x1 =
        (node.x0 =
          x0 +
          Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x)))) *
            kx) + dx;
    });
  }

  function computeNodeBreadths(graph) {
    var columns = nest()
      .key(function(d) {
        return d.x0;
      })
      .sortKeys(ascending)
      .entries(graph.nodes)
      .map(function(d) {
        return d.values;
      });

    //
    initializeNodeBreadth();
    resolveCollisions();
    for (var alpha = 1, n = iterations; n > 0; --n) {
      relaxRightToLeft((alpha *= 0.99));
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeBreadth() {
      var ky = min(columns, function(nodes) {
        return (y1 - y0 - (nodes.length - 1) * py) / sum(nodes, value);
      });

      columns.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          node.y1 = (node.y0 = i) + node.value * ky;
        });
      });

      graph.links.forEach(function(link) {
        link.width = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      columns.forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var dy =
              (sum(node.targetLinks, weightedSource) /
                sum(node.targetLinks, value) -
                nodeCenter(node)) *
              alpha;
            (node.y0 += dy), (node.y1 += dy);
          }
        });
      });
    }

    function relaxRightToLeft(alpha) {
      columns
        .slice()
        .reverse()
        .forEach(function(nodes) {
          nodes.forEach(function(node) {
            if (node.sourceLinks.length) {
              var dy =
                (sum(node.sourceLinks, weightedTarget) /
                  sum(node.sourceLinks, value) -
                  nodeCenter(node)) *
                alpha;
              (node.y0 += dy), (node.y1 += dy);
            }
          });
        });
    }

    // 桑基图中水平方向的布局由节点深度信息决定，而垂直方向的布局由具有相同深度的节点数目构成
    // columns数组的每个元素就是有一组具有相同深度的节点构成的集合
    function resolveCollisions() {
      columns.forEach(function(nodes) {
        var node,
          dy,
          y = y0,
          n = nodes.length,
          i;

        // Push any overlapping nodes down.
        //
        nodes.sort(ascendingBreadth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y - node.y0;
          if (dy > 0) (node.y0 += dy), (node.y1 += dy);
          y = node.y1 + py;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y - py - y1;
        if (dy > 0) {
          (y = node.y0 -= dy), (node.y1 -= dy);

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y1 + py - y;
            if (dy > 0) (node.y0 -= dy), (node.y1 -= dy);
            y = node.y0;
          }
        }
      });
    }
  }

  function computeLinkBreadths(graph) {
    graph.nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetBreadth);
      node.targetLinks.sort(ascendingSourceBreadth);
    });
    graph.nodes.forEach(function(node) {
      var y0 = node.y0,
        y1 = y0;
      node.sourceLinks.forEach(function(link) {
        (link.y0 = y0 + link.width / 2), (y0 += link.width);
      });
      node.targetLinks.forEach(function(link) {
        (link.y1 = y1 + link.width / 2), (y1 += link.width);
      });
    });
  }

  return sankey;
}
