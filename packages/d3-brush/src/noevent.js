import {event} from "d3-selection";

export function nopropagation() {
  // 阻止事件冒泡并阻止相同事件的其他侦听器被调用，属于W3C规范
  event.stopImmediatePropagation();
}

export default function() {
  event.preventDefault();
  event.stopImmediatePropagation();
}
