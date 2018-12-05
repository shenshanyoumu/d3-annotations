// D3中选择集实现了数据集与DOM集的绑定，但是当DOM集大于数据集时就需要手动删除DOM
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

export default function() {
  return this.each(remove);
}
