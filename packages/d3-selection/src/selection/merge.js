import {Selection} from "./index";

/** 两个选择集的合并处理，具体操作是将this._groups作为主体 */
export default function(selection) {

  /** this表示当前节点，而selection表示已经存在的选择集对象 */
  for (var groups0 = this._groups, groups1 = selection._groups, 
    m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1),
     merges = new Array(m0), j = 0; j < m; ++j) {

    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, 
      merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      
      // 注意上面merge=merges[i]，意味着merge的修改基于引用机制也会同步修改到merge[j]对象上
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  /** 如果groups0的长度为m，则下面操作跳过；如果groups0的长度比m大，则需要将groups0剩余选择集追加 */
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}
