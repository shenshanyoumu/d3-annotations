
// 节点的value属性存放所有后代节点的value累加值，用于绘制图表
function count(node) {
  var sum = 0,
      children = node.children,
      i = children && children.length;
  if (!i) sum = 1;
  else while (--i >= 0) sum += children[i].value;
  node.value = sum;
}

// 从下到上逐层遍历计算
export default function() {
  return this.eachAfter(count);
}
