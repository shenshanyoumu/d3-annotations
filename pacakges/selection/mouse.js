// D3的事件系统中定义了事件源，以及各种事件绑定/解绑，和分发逻辑
import sourceEvent from "./sourceEvent";
import point from "./point";

export default function(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];

  // point对象封装了DOM节点和对应的事件
  return point(node, event);
}
