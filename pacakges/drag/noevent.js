import { event } from "d3-selection";

// 注意d3-selection在选择document上的元素时，也会得到元素的原生event对象
export function nopropagation() {
  event.stopImmediatePropagation();
}

export default function() {
  event.preventDefault();
  event.stopImmediatePropagation();
}
