import {event} from "./selection/on";

// 基于事件冒泡和捕获原理，从当前事件对象event开始遍历，得到事件的source节点
export default function() {
  var current = event, source;
  while (source = current.sourceEvent) current = source;
  return current;
}
