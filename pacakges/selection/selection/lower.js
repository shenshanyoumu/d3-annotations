// 下面就是在插入DOM节点时，从容器节点的孩子节点数组前面插入
function lower() {
  if (this.previousSibling)
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

export default function() {
  return this.each(lower);
}
