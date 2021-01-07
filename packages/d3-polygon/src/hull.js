import cross from "./cross.js";

// 排序子函数，先根据坐标点X分量升序排序。
// 如果X坐标分量相同，则再根据Y分量升序排序
function lexicographicOrder(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}


// 计算多边形上凸包，返回构成凸包的坐标点索引
function computeUpperHullIndexes(points) {
  var n = points.length,
      indexes = [0, 1],
      size = 2;

  for (var i = 2; i < n; ++i) {

    // 三个顶点ABC构成两个向量，通过计算向量叉积来判断三个节点是否共线、
    // 逆时针或者顺时针等状态
    // 由于构造多边形的顶点逆时针顺序，因此作图可知当AB和AC向量叉积为正数则形成凸包
    // 否则三个点构造的曲线"凹"型
    while (size > 1 && cross(points[indexes[size - 2]], 
      points[indexes[size - 1]], points[i]) <= 0) 
      --size;

    // 加入凸包的临时索引
    indexes[size++] = i;
  }

  return indexes.slice(0, size); // remove popped points
}


export default function(points) {
  if ((n = points.length) < 3) return null;

  var i,
      n,
      sortedPoints = new Array(n),
      flippedPoints = new Array(n);

  // sortedPoints数组每个元素为三元组，表示顶点分量和原始索引
  for (i = 0; i < n; ++i) 
    sortedPoints[i] = [+points[i][0], +points[i][1], i];

  // 按照顶点X轴升序降序，同X坐标分量则Y轴升序排序。
  // 注意sortedPoints数组元素保存了原始的元素索引
  sortedPoints.sort(lexicographicOrder);

  // 将多边形顶点Y轴分量取反，相当于将多边形下部变换为上部
  for (i = 0; i < n; ++i) 
    flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

  // 计算凸包的上下两部分顶点索引
  var upperIndexes = computeUpperHullIndexes(sortedPoints),
      lowerIndexes = computeUpperHullIndexes(flippedPoints);

  // 将上下两部分顶点索引的铰链节点去掉
  var skipLeft = lowerIndexes[0] === upperIndexes[0],
      skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1],
      hull = [];

  // 注意上部分凸包索引顺序和下部分凸包索引顺序不一致，
  // 因此最终的凸包索引是按照逆时针顺序
  for (i = upperIndexes.length - 1; i >= 0; --i) 
    hull.push(points[sortedPoints[upperIndexes[i]][2]]);

  for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i) 
    hull.push(points[sortedPoints[lowerIndexes[i]][2]]);

  return hull;
}
