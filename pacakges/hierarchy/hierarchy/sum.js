// 按照后序遍历当前节点及其后代节点，并计算节点的value。
// 根据下面定义，节点value等于所有后代节点value之和
export default function(value) {
  return this.eachAfter(function(node) {
    var sum = +value(node.data) || 0,
      children = node.children,
      i = children && children.length;
    while (--i >= 0) {
      sum += children[i].value;
    }
    node.value = sum;
  });
}
