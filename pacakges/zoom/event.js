// 定义缩放事件实例
export default function ZoomEvent(target, type, transform) {
  this.target = target;
  this.type = type;

  // 注意下面transform与CSS的transform不一样，因为数据集的可视化本质上是定义域和值域的映射变换，而不单纯是DOM元素的缩放变换
  this.transform = transform;
}
