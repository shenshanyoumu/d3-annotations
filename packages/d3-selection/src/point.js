/** node表示宿主环境，比如window、global或者document对象等；返回当前点击位置坐标 */
export default function(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;

    /** 将基于viewpoint视口的坐标转换为svg画布坐标，并返回转换后的坐标 */
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  /** 获得viewpoint中DOM元素的位置和尺寸 */
  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}
