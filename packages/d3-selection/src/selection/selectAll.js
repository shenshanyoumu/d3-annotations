import {Selection} from "./index";
import selectorAll from "../selectorAll";

export default function(select) {
  if (typeof select !== "function") select = selectorAll(select);

  /** 旧知识：for循环第一个";"前面的语句只会初始化一次；groups的两层结构，第二层group每个元素依次执行select操作
   *  函数总体功能，就是将_groups里面所有node添加到parents中；而subgroups的节点为所有node执行select后的结果集
   */
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}
