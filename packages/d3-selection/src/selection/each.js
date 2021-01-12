/** 对选择集节点的遍历访问 */
export default function(callback) {

  /** 处理双重选择集的遍历，类似二维数组 */
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {


      // 选择集上的元素依次回调，node.__data__即将数据关联到node的特定属性上
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}
