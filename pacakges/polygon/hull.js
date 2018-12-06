import cross from "./cross";

function lexicographicOrder(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

// 迭代计算图形X轴上部最外围顶点集，主要思路是根据向量的叉积大小来迭代
function computeUpperHullIndexes(points) {
  var n = points.length,
    indexes = [0, 1],
    size = 2;

  // 不断迭代，每次找到比当前点更外围的点，直到再也没有更外围点出现，则说明该点即凸包的候选点
  for (var i = 2; i < n; ++i) {
    while (
      size > 1 &&
      cross(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <=
        0
    )
      --size;
    indexes[size++] = i;
  }

  return indexes.slice(0, size); // remove popped points
}

// 计算给定点集的凸包，所谓凸包就是包含所有点的最小多边形的顶点集
export default function(points) {
  // 点集的长度小于3，显然无法构成多边形
  if ((n = points.length) < 3) return null;

  var i,
    n,
    sortedPoints = new Array(n),
    flippedPoints = new Array(n);

  for (i = 0; i < n; ++i) {
    // sortedPoints保存所有点及其索引值
    sortedPoints[i] = [+points[i][0], +points[i][1], i];
  }

  //根据点坐标距离进行排序，最终形成的排序点按照点X轴向从大到小排序，对于具有相同X值的点再根据Y轴从大到小排序
  sortedPoints.sort(lexicographicOrder);
  for (i = 0; i < n; ++i) {
    // 基于X轴反转点位置
    flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];
  }

  // 找到凸多边形X轴上下部分的顶点集
  var upperIndexes = computeUpperHullIndexes(sortedPoints),
    lowerIndexes = computeUpperHullIndexes(flippedPoints);

  //合并上面顶点集，删除多余的端点
  var skipLeft = lowerIndexes[0] === upperIndexes[0],
    skipRight =
      lowerIndexes[lowerIndexes.length - 1] ===
      upperIndexes[upperIndexes.length - 1],
    hull = [];

  //  由于上下部分顶点集顺序相反，因此重新排序
  for (i = upperIndexes.length - 1; i >= 0; --i)
    hull.push(points[sortedPoints[upperIndexes[i]][2]]);
  for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i)
    hull.push(points[sortedPoints[lowerIndexes[i]][2]]);

  return hull;
}
