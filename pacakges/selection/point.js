/**
 *
 * @param {*} node 继承自HTMLNode的DOM节点对象
 * @param {*} event
 */
export default function(node, event) {
  var svg = node.ownerSVGElement || node;

  // 基于SVG创建一个点元素并设置坐标
  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    (point.x = event.clientX), (point.y = event.clientY);
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  // 下面getBoundingClientRect是相对于当前viewport而言
  var rect = node.getBoundingClientRect();
  return [
    event.clientX - rect.left - node.clientLeft,
    event.clientY - rect.top - node.clientTop
  ];
}
