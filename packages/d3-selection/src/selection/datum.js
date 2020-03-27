// 当前节点的数据绑定或者返回节点原值
export default function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}
