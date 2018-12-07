// 先序访问节点及其后代节点
export default function(callback) {
  var node = this,
    nodes = [node],
    children,
    i;

  // 每次对父节点调用callback，然后再将子节点压入nodes临时数组
  while ((node = nodes.pop())) {
    callback(node), (children = node.children);
    if (children)
      for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i]);
      }
  }
  return this;
}
