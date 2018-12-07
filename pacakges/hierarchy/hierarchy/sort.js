// 对当前this节点及其后代节点进行排序，排序器由外部传入
export default function(compare) {
  return this.eachBefore(function(node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}
