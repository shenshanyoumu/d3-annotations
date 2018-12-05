// 绑定数据集与DOM节点。注意下面当传递参数value，则将value作为__data__属性保存
// 因此D3 的selection模块中__data__就是关键的数据保存/引用属性
export default function(value) {
  return arguments.length
    ? this.property("__data__", value)
    : this.node().__data__;
}
