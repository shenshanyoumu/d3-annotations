import sourceEvent from "./sourceEvent";
import point from "./point";

// 鼠标事件记录选定的DOM节点，以及事件内容
export default function(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}
