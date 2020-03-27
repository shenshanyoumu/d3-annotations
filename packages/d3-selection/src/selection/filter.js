import {Selection} from "./index";
import matcher from "../matcher";

// 在进行update操作时，需要根据match函数来分类enter新增的节点、exit需要删除的节点等
export default function(match) {
  // match基于DOM的matcher来匹配选择器，如果是字符串选择器则转换为函数
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {

      // 如果选择集中的节点匹配match函数，则将节点添加到数组
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}
