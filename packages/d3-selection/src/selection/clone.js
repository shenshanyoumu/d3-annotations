// 基于DOM的cloneNode方法，如果参数为false则只克隆当前节点；否则递归克隆后代节点
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

export default function(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
