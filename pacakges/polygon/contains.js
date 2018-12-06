/**
 * 判断测试点是否在多边形内部
 * @param {*} polygon 构成多边形的有序顶点集
 * @param {*} point 给定测试点
 */
export default function(polygon, point) {
  var n = polygon.length,
    p = polygon[n - 1],
    x = point[0],
    y = point[1],
    x0 = p[0],
    y0 = p[1],
    x1,
    y1,
    inside = false;

  for (var i = 0; i < n; ++i) {
    (p = polygon[i]), (x1 = p[0]), (y1 = p[1]);

    // 下面代码根据测试点坐标与多边形顶点坐标的位置比较来判断，需要注意凹型图的测试
    if (y1 > y !== y0 > y && x < ((x0 - x1) * (y - y1)) / (y0 - y1) + x1) {
      inside = !inside;
    }

    (x0 = x1), (y0 = y1);
  }

  return inside;
}
