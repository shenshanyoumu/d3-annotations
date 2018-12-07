export default function() {
  var root = this,
    links = [];

  // 对树形结构中相邻节点连接处理
  root.each(function(node) {
    if (node !== root) {
      // Don’t include the root’s parent, if any.
      links.push({ source: node.parent, target: node });
    }
  });
  return links;
}
