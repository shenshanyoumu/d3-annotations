
/**
 * 如果当前节点左边兄弟节点存在，则将当前节点插入到所有兄弟节点前面
 */
function lower() {
  if (this.previousSibling) 
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

export default function() {
  return this.each(lower);
}
