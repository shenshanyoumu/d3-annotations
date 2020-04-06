import {event} from "d3-selection";

// 标准的W3C事件方法，用于阻止事件冒泡
export function nopropagation() {
  event.stopImmediatePropagation();
}

// 阻止事件默认行为，联想form表单button点击或者浏览器地址栏内容变化的默认行为
export default function() {
  event.preventDefault();
  event.stopImmediatePropagation();
}
