
// 判定给定点point与polygon是否存在包含关系
export default function(polygon, point) {
  var n = polygon.length,
      p = polygon[n - 1],
      x = point[0], y = point[1],
      x0 = p[0], y0 = p[1],
      x1, y1,
      inside = false;

  for (var i = 0; i < n; ++i) {
    p = polygon[i], x1 = p[0], y1 = p[1];

    // point与多边形边的位置关系
    if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1))
       inside = !inside;

    x0 = x1, y0 = y1;
  }

  return inside;
}
