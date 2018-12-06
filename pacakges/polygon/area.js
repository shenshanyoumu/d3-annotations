/**
 *
 * @param {*} polygon 表示构成多边形的具有顺序的顶点集
 */
export default function(polygon) {
  var i = -1,
    n = polygon.length,
    a,
    b = polygon[n - 1],
    area = 0;

  // 多边形面积计算，可以分割为一系列三角形求面积再累加
  while (++i < n) {
    a = b;
    b = polygon[i];
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area / 2;
}
