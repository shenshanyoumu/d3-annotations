// value函数描述节点的关键字，即从data对象中获取表征当前节点数值意义的字段
export default function(value) {

  // 计算当前节点及其后代节点的value累加值
  return this.eachAfter(function(node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;
    while (--i >= 0) sum += children[i].value;
    node.value = sum;
  });
}
