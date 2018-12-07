/**
 * 聚类布局器
 */

//  判定两个节点是否是兄弟节点
function defaultSeparation(a, b) {
  return a.parent === b.parent ? 1 : 2;
}

// 计算当前节点所有子节点在X轴上的平均坐标
function meanX(children) {
  return children.reduce(meanXReduce, 0) / children.length;
}

function meanXReduce(x, c) {
  return x + c.x;
}

// 计算当前节点所有子节点在Y轴上最大坐标位置
function maxY(children) {
  return 1 + children.reduce(maxYReduce, 0);
}

function maxYReduce(y, c) {
  return Math.max(y, c.y);
}

// 迭代计算当前节点的第一个叶子节点
function leafLeft(node) {
  var children;
  while ((children = node.children)) {
    node = children[0];
  }
  return node;
}

//计算得到当前节点最右边的叶子节点
function leafRight(node) {
  var children;
  while ((children = node.children)) {
    node = children[children.length - 1];
  }
  return node;
}

// 聚类布局器，在聚类树形图、Node-Link图等大量使用
export default function() {
  var separation = defaultSeparation,
    dx = 1,
    dy = 1,
    nodeSize = false;

  function cluster(root) {
    var previousNode,
      x = 0;

    // eachAfter方法按照后序遍历给定节点所有后代节点
    root.eachAfter(function(node) {
      var children = node.children;
      if (children) {
        node.x = meanX(children);
        node.y = maxY(children);
      } else {
        node.x = previousNode ? (x += separation(node, previousNode)) : 0;
        node.y = 0;
        previousNode = node;
      }
    });

    var left = leafLeft(root),
      right = leafRight(root),
      x0 = left.x - separation(left, right) / 2,
      x1 = right.x + separation(right, left) / 2;

    // Second walk, normalizing x & y to the desired size.
    return root.eachAfter(
      nodeSize
        ? function(node) {
            node.x = (node.x - root.x) * dx;
            node.y = (root.y - node.y) * dy;
          }
        : function(node) {
            node.x = ((node.x - x0) / (x1 - x0)) * dx;
            node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
          }
    );
  }

  cluster.separation = function(x) {
    return arguments.length ? ((separation = x), cluster) : separation;
  };

  cluster.size = function(x) {
    return arguments.length
      ? ((nodeSize = false), (dx = +x[0]), (dy = +x[1]), cluster)
      : nodeSize
      ? null
      : [dx, dy];
  };

  cluster.nodeSize = function(x) {
    return arguments.length
      ? ((nodeSize = true), (dx = +x[0]), (dy = +x[1]), cluster)
      : nodeSize
      ? [dx, dy]
      : null;
  };

  return cluster;
}
