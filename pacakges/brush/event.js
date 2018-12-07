// 刷子事件对象包含事件源、事件类型，以及刷子选择集
export default function(target, type, selection) {
  this.target = target;
  this.type = type;
  this.selection = selection;
}
