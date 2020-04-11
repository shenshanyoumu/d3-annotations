export default function(callback) {
  var node = this, current, next = [node], children, i, n;
  do {

    // revere的作用是，针对同一层也保持从左到右遍历顺序
    current = next.reverse(), next = [];

    // 从上到下、从左到右的逐层遍历
    while (node = current.pop()) {
      callback(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        next.push(children[i]);
      }
    }
  } while (next.length);
  return this;
}
