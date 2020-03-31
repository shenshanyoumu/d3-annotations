// 多边形面积计算，按逆时针定义顶点数组polygon
export default function(polygon) {
  var i = -1,
      n = polygon.length,
      a,
      b = polygon[n - 1],
      area = 0;

  while (++i < n) {
    a = b;
    b = polygon[i];

    // 通过几何作图来解释，将多边形三角化处理后计算面积
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area / 2;
}
