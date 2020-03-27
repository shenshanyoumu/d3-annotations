/** 注意下面两个this的差异，第二个this表示遍历节点的对象 */
export default function() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}
