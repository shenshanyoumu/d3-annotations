// compare比较函数，可以是按照子节点X轴坐标大小排序，可以是按照子节点的value值排序
// 这个sort函数用于在绘制图表时的定制化需求
export default function(compare) {
  return this.eachBefore(function(node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}
