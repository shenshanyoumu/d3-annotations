import {Selection} from "./index";

export default function(compare) {

  /** 排序算子，默认为关键字升序排序 */
  if (!compare) compare = ascending;

  /** 参数是DOM对象，因此不能简单比较大小
   *  需要选择对象关键字进行比较 */
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  /** 对sortGroups中每个group进行关键字升序排序 */
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
     
      //  注意sortgroup和sortgroups[i]指向同一个引用地址，因此对sortgroup进行排序，实际上也会影响sortgroups
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  /** Selection构造函数，第二个参数是数组，其作用是可以通过d3-selection选择器同时选择多个集合 */
  return new Selection(sortgroups, this._parents).order();
}

/** >= 操作看似多余，实际上主要用于等值比较 */
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
