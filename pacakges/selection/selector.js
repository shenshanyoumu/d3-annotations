function none() {}

// 传入DOM节点选择器字符串，返回DOM节点选择函数。
// D3源码中很少存在直接计算值的函数，大多都是返回一个包装函数
export default function(selector) {
  return selector == null
    ? none
    : function() {
        return this.querySelector(selector);
      };
}
