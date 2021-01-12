import sourceEvent from "./sourceEvent";
import point from "./point";

/** 框架设计思路：d3.js侧重表现层，因此需要考虑如何将
 * 事件操作进行可视化表达，下面的代码很好诠释了事件系统与
 * 可视系统的连接方式
 */
export default function(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  // touches表示屏幕上的多触点坐标集，多触点坐标转换为node上下文的坐标点集
  // 比如将屏幕坐标系的事件坐标转换为SVG上下文的坐标
  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
}
