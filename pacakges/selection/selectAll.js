import { Selection, root } from "./selection/index";

// 对DOM规范原生的全选选择器进行了封装
export default function(selector) {
  return typeof selector === "string"
    ? new Selection(
        [document.querySelectorAll(selector)],
        [document.documentElement]
      )
    : new Selection([selector == null ? [] : selector], root);
}
