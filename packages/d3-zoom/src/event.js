// 与d3-drag模块定义的事件对象类似
export default function ZoomEvent(target, type, transform) {
  this.target = target;
  this.type = type;
  this.transform = transform;
}
