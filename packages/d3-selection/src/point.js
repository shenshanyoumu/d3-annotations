/** node表示宿主环境，比如window、global或者document对象等；
 * 返回当前点击位置坐标 */
export default function(node, event) {
  var svg = node.ownerSVGElement || node;

  //在SVG坐标系统创建点对象
  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();

    // 将事件发生时的坐标赋值，注意当前坐标系是屏幕坐标系
    point.x = event.clientX, point.y = event.clientY;

    /** 将基于viewpoint视口的坐标转换为svg画布坐标，并返回转换后的坐标 */
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  /** 将事件发生时的屏幕坐标转化为node上下文的坐标，类似将屏幕坐标转换为svg画布坐标 */
  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft,
          event.clientY - rect.top - node.clientTop];
}
