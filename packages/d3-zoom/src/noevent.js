import {event} from "d3-selection";

// 标准的W3C 事件规范
export function nopropagation() {
  event.stopImmediatePropagation();
}

export default function() {
  event.preventDefault();
  event.stopImmediatePropagation();
}
