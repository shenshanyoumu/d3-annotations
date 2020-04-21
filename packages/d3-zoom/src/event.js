// 与d3-drag模块定义的事件对象类似。target表示真正触发事件的节点，type表示zoom事件类型
// transform表示事件对象中包含的具体的缩放、平移转换逻辑
export default function ZoomEvent(target, type, transform) {
  this.target = target;
  this.type = type;
  this.transform = transform;
}
