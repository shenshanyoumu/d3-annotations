import creator from "./creator";
import select from "./select";

// creator本质上就是依托DOM规范+宿主实现
// select抽象了DOM节点选择和节点的事件分发机制
export default function(name) {
  return select(creator(name).call(document.documentElement));
}
