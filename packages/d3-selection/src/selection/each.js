/** 对选择集节点的遍历访问 */
export default function(callback) {

  /** 选择集作为数组元素存在，这样便于多个选择集的处理 */
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {


      // 选择集节点的变量，实际上就是在回调函数中传递节点的__data__数据
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}
