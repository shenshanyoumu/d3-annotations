// matches函数实际上属于W3C的DOM规范
var matcher = function(selector) {
  return function() {
    return this.matches(selector);
  };
};

// W3C规范中对DOM节点处于选择器字符串选中状态进行了定义
if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!element.matches) {
    var vendorMatches =
      element.webkitMatchesSelector ||
      element.msMatchesSelector ||
      element.mozMatchesSelector ||
      element.oMatchesSelector;
    matcher = function(selector) {
      return function() {
        return vendorMatches.call(this, selector);
      };
    };
  }
}

export default matcher;
