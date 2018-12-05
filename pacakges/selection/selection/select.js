import { Selection } from "./index";
import selector from "../selector";

export default function(select) {
  // 如果参数不是函数，则构造为选择器函数
  if (typeof select !== "function") {
    select = selector(select);
  }

  for (
    var groups = this._groups,
      m = groups.length,
      subgroups = new Array(m),
      j = 0;
    j < m;
    ++j
  ) {
    for (
      var group = groups[j],
        n = group.length,
        subgroup = (subgroups[j] = new Array(n)),
        node,
        subnode,
        i = 0;
      i < n;
      ++i
    ) {
      if (
        (node = group[i]) &&
        (subnode = select.call(node, node.__data__, i, group))
      ) {
        // 这是数据集绑定时存储在DOM节点的__data__属性的数据
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}
