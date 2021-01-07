/** 如果当前节点存在右兄弟节点，则将当前节点从节点列表中删除并添加到列表尾部 */
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

export default function() {
  return this.each(raise);
}
