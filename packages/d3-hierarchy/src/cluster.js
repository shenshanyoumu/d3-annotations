// 用于分离两个布局图上的相邻节点，注意相邻节点可能是兄弟节点，也可能不是因此需要区别
function defaultSeparation(a, b) {
  return a.parent === b.parent ? 1 : 2;
}

// 用于绘图的布局美化，计算某个节点所有子节点的X轴坐标均值
function meanX(children) {
  return children.reduce(meanXReduce, 0) / children.length;
}

function meanXReduce(x, c) {
  return x + c.x;
}

// 用于绘图布局美化，计算某个节点所有孩子节点Y坐标的最大值
function maxY(children) {
  return 1 + children.reduce(maxYReduce, 0);
}

function maxYReduce(y, c) {
  return Math.max(y, c.y);
}

// 节点node最左边叶子节点
function leafLeft(node) {
  var children;
  while (children = node.children) node = children[0];
  return node;
}

// 节点node最右叶子节点
function leafRight(node) {
  var children;
  while (children = node.children) node = children[children.length - 1];
  return node;
}

// cluster生成器，用于绘制cluster形态的图表
export default function() {
  var separation = defaultSeparation,

      // dx和dy表示当前cluster在页面上占据的宽高尺寸
      dx = 1,
      dy = 1,

      // 是否定义了节点的宽高尺寸，默认没有则绘图时根据布局图尺寸来自动设置
      nodeSize = false;

  function cluster(root) {
    var previousNode,
        x = 0;

    // 第一次迭代： 按照从下到上层级遍历结构对象
    // 用于初始化每个节点node相对于孩子节点的坐标布局
    root.eachAfter(function(node) {
      var children = node.children;
      if (children) {
        node.x = meanX(children);
        node.y = maxY(children);
      } else {
        node.x = previousNode ? x += separation(node, previousNode) : 0;
        node.y = 0;
        previousNode = node;
      }
    });

    //  整个cluster结构中，得到最左边叶子节点和最右边叶子节点，用于约束布局范围
    // 其他节点的布局坐标显然都应该在这个范围内
    var left = leafLeft(root),
        right = leafRight(root),


        x0 = left.x - separation(left, right) / 2,
        x1 = right.x + separation(right, left) / 2;

    // 第二轮迭代，将cluster中的节点坐标归一化到[dx,dy]区间内
    // 这也是真正能够绘制到图表上的坐标位置
    return root.eachAfter(nodeSize ? function(node) {
      // 当node为root节点时，则可知root节点被放置在[0,0]坐标位置

      // 注意下面cluster的形态是根节点在原点，根据svg坐标系特点，其他node节点逐层向上添加
      node.x = (node.x - root.x) * dx;
      node.y = (root.y - node.y) * dy;
    } : function(node) {

      // dx是整个cluster图表的宽度，下面根据比例关系计算最后布局中各个点的坐标
      node.x = (node.x - x0) / (x1 - x0) * dx;
      node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
    });
  }

  // 对cluster的分叉处理，参数x是一个函数，用于描述两个节点是否需要分叉
  cluster.separation = function(x) {
    return arguments.length ? (separation = x, cluster) : separation;
  };

  // 设置cluster布局的宽高尺寸
  cluster.size = function(x) {
    return arguments.length ? (nodeSize = false,
       dx = +x[0], dy = +x[1], cluster) : (nodeSize ? null : [dx, dy]);
  };

  // 如果设置了cluster布局的节点尺寸[dx,dy]，则root节点被放置在[0,0]坐标点
  cluster.nodeSize = function(x) {
    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], cluster) : (nodeSize ? [dx, dy] : null);
  };

  return cluster;
}
