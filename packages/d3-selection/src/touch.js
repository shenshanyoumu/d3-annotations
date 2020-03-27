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

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}
