function empty() {
  return [];
}

// 根据传递的选择字段，返回全选逻辑的选择器函数
export default function(selector) {
  return selector == null
    ? empty
    : function() {
        return this.querySelectorAll(selector);
      };
}
