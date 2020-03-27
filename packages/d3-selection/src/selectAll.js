import {Selection, root} from "./selection/index";

// document.documentElement返回当前document对象包含的完整HTML页面
export default function(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : selector], root);
}
