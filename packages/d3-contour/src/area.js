/**
 * 计算环形图形面积，注意与d3-polygon计算多边形面积的差别。下面的area是否忘记除以2了？
 * @param {*} ring 环形图形的顶点逆时针访问
 */
export default function(ring) {
  var i = 0, n = ring.length, 
  area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];

  while (++i < n) 
    area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];

  return area;
}
