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

// 节点访问器
function defaultNodes(graph) {
  return graph.nodes;
}

// 连线访问器
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

    // 先计算图中Node与Link的双向连接关系
    computeNodeLinks(graph);

    // 计算每个节点的value
    computeNodeValues(graph);

    // 计算图中每个Node的深度/高度信息。所谓深度/高度相对于桑基图的最终展示形式而言，一般只取其一
    computeNodeDepths(graph);

    // 迭代调整，图中所有节点在水平方向的位置，以及垂直方向的位置
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
   * 返回Node/Link双向连接信息
   * @param {*} graph 包含Nodes和Links的图结构
   */
  function computeNodeLinks(graph) {
    // 最开始Nodes信息只有基本的连接关系，其他信息都需要计算得到
    graph.nodes.forEach(function(node, i) {
      node.index = i;
      node.sourceLinks = []; //从该节点发出的Links集合
      node.targetLinks = []; //汇聚到该节点的Links集合
    });

    // 注意map结构在d3-collection的实现
    var nodeById = map(graph.nodes, id);

    graph.links.forEach(function(link, i) {
      link.index = i;
      var source = link.source,
        target = link.target;

      // 有时候为了节省网络传输，在生成桑基图时传递的Links数组中每个Link的source/target
      // 可能是一个字符串，通过该字符串在Nodes集合找到对应的节点
      if (typeof source !== "object") {
        source = link.source = find(nodeById, source);
      }

      if (typeof target !== "object") {
        target = link.target = find(nodeById, target);
      }

      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // 根据节点的sourceLinks/targetLinks的流量值得到节点的值
  function computeNodeValues(graph) {
    graph.nodes.forEach(function(node) {
      // 在最初的传递给graph的links参数中，每个links具有value信息。当然如果没有value信息则设置默认值0
      node.value = Math.max(
        sum(node.sourceLinks, value),
        sum(node.targetLinks, value)
      );
    });
  }

  //  迭代计算图中所有节点的深度
  function computeNodeDepths(graph) {
    var nodes, next, x;

    // 计算Node深度的算法块，该算法的运行过程如下
    // （1）初始化Nodes为graph中所有Nodes组成的集合
    // （2）第一轮遍历，所有Node的深度为0，并且将所有Link的target节点存储在next数组。显然桑基图最左边的节点将不会出现在next数组
    // （3）第二轮遍历next数组，其中所有Node节点深度为1，并且该数组中每个node的sourceLinks一定有对应的target，将target节点存储在下一轮next数组
    // 。。。
    // 多轮迭代，直到最后一些节点再也没有sourceLinks，表示这些节点为桑基图最右边节点
    // 从而得到每个节点的深度
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

    // 当桑基图垂直布局，则需要计算每个节点的高度，方法与上面计算深度类似
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

    // 生成器的图表空间与节点深度最大值相比，得到一个用于真实绘制的比例系数
    var kx = (x1 - x0 - dx) / (x - 1);

    // 计算图中所有节点在当前[0,1]空间的点位置
    graph.nodes.forEach(function(node) {
      node.x1 =
        (node.x0 =
          x0 +
          Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x)))) *
            kx) + dx;
    });
  }

  // 计算图中每个节点在垂直方向上的上下沿坐标；当然对于垂直布局的桑基图，则计算水平方向上的前后两个坐标
  function computeNodeBreadths(graph) {
    // 定义的嵌套生成器，基于图中nodes的x0坐标的升序排序，并且对于相同x0的点作为一个group存储

    var columns = nest()
      .key(function(d) {
        return d.x0;
      })
      .sortKeys(ascending)
      .entries(graph.nodes)
      .map(function(d) {
        return d.values;
      });

    //计算图中节点在垂直方向上的上下沿坐标y0/y1
    initializeNodeBreadth();

    // 解决垂直方向上两个node的重叠问题
    resolveCollisions();

    // alpha控制每次调整的幅度，从大幅度的水平移动节点到最后微调
    for (var alpha = 1, n = iterations; n > 0; --n) {
      relaxRightToLeft((alpha *= 0.99));
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    // 计算所有节点在垂直区域的y0/y1坐标
    function initializeNodeBreadth() {
      // 注意下面nodes.length表示具有相同x0的一组节点的数量；
      // 而sum(nodes,value)主要的意义在于每个Node在垂直方向上尺寸需要由之前value来决定，而value也决定Link的绘制宽度
      var ky = min(columns, function(nodes) {
        return (y1 - y0 - (nodes.length - 1) * py) / sum(nodes, value);
      });

      // columns中每个元素是一个数组，而数组中所有节点具有相同的x0，即相同深度
      // 根据上面的ky比例，计算同一列中每个节点的上下沿坐标y0/y1
      columns.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          node.y1 = (node.y0 = i) + node.value * ky;
        });
      });

      // 同理，每个Link的绘制宽度也由Link的value决定，ky只是关于value与绘制空间的比例
      graph.links.forEach(function(link) {
        link.width = link.value * ky;
      });
    }

    // 桑基图中最左边节点开始
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

    // columns元素反转，即从桑基图最右边一列节点开始计算
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

    // 之前的运算并没有考虑Node在垂直方向上的padding，因此加上padding后就需要迭代调整坐标
    function resolveCollisions() {
      columns.forEach(function(nodes) {
        var node,
          dy,
          y = y0,
          n = nodes.length,
          i;

        // Push any overlapping nodes down.
        // 在同一列中，根据节点矩形的高度尺寸升序
        nodes.sort(ascendingBreadth);

        // 对每个节点在垂直方向上增加padding
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y - node.y0;
          if (dy > 0) {
            (node.y0 += dy), (node.y1 += dy);
          }
          y = node.y1 + py;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y - py - y1;
        if (dy > 0) {
          (y = node.y0 -= dy), (node.y1 -= dy);

          // 对于发生重叠的节点，向上移动解决重叠
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

  // 计算Link的绘制宽度
  function computeLinkBreadths(graph) {
    // 对图中每个节点的sourceLinks/targetLinks分布升序
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
