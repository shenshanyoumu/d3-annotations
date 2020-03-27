
// 当前元素被字符串选择器选择，则返回true
export default function(selector) {
  return function() {
    return this.matches(selector);
  };
}
