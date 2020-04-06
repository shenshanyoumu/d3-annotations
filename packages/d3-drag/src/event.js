export default function DragEvent(target, type, subject, 
  id, active, x, y, dx, dy, dispatch) {
  
  // target表示拖拽的目标DOM节点，subject表示当前拖拽行为的描述对象。
  // type表示拖拽事件类型，identifier表示当前拖拽行为的ID，d3用于组织管理多个拖拽过程
  this.target = target;
  this.type = type;
  this.subject = subject;

  // 当设备支持多个触控点时，需要通过id来区分
  this.identifier = id;
  this.active = active;

  // 拖拽开始坐标，以及拖拽位移量
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;

  // 基于d3-dispatch的事件分发机制
  this._ = dispatch;
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};
