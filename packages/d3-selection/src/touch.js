import sourceEvent from "./sourceEvent";
import point from "./point";

/**
 * 考虑touch事件规范，对touches、targetTouches和changedTouches的理解
 * @param {*} node 
 * @param {*} touches 
 * @param {*} identifier 
 */
export default function(node, touches, identifier) {
  if (arguments.length < 3) 
    identifier = touches, touches = sourceEvent().changedTouches;

  // 遍历触控点列表，针对特定的手势事件类型进行筛选并返回相应的坐标点
  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}
