function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

/** 删除节点，必须通过父节点删除，不然导致整个DOM树引用消失 */
export default function() {
  return this.each(remove);
}
