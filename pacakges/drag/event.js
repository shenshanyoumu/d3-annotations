export default function DragEvent(
  target,
  type,
  subject,
  id,
  active,
  x,
  y,
  dx,
  dy,
  dispatch
) {
  this.target = target; //表示触发事件的事件源
  this.type = type; //事件类型
  this.subject = subject; //拖拽中保存的数据
  this.identifier = id; //该事件实例ID
  this.active = active; //事件是否还未处理
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

// 注意this._指向dispatch实例，因此继承了dispatch的事件绑定和分发能力
DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};
