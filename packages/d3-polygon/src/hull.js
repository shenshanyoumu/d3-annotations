import cross from "./cross.js";

// 先按照坐标点X轴降序，如果X轴相同则对Y轴降序
function lexicographicOrder(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}


// 将多边形切割为上下两部分，计算上部分构造最终凸包的顶点索引集合
// 下部分的凸包点索引集合计算方式还是基于下面函数，只是将下部分顶点顺序逆转即可
function computeUpperHullIndexes(points) {
  var n = points.length,


      indexes = [0, 1],
      size = 2;

  for (var i = 2; i < n; ++i) {

    // 三个顶点ABC构成两个向量，通过计算向量叉积来判断三个节点是否共线、
    // 逆时针或者顺时针，如果是逆时针则说明这三个点属于凸包点；如果顺时针
    // 则意味着有顶点“凹陷”，不属于最终凸包顶点
    while (size > 1 && cross(points[indexes[size - 2]], 
      points[indexes[size - 1]], points[i]) <= 0) 
      --size;

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

  // 按照顶点X轴升序降序，同X坐标分量则Y轴降序排序
  sortedPoints.sort(lexicographicOrder);

  // 将多边形顶点X轴分量反转，相当于将多边形下部变换为上部
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
