import defaultView from "../window";

// 遵循W3C规范，用于删除特定的DOM样式
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

/** DOM元素具有style属性，是DOM提供给JS操作的接口 */
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

/** style对象的属性的赋值或者删除属性 */
function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

export default function(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

/** 基础方法都遵循标准的W3C规范 */
export function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node)
        .getComputedStyle(node, null)
        .getPropertyValue(name);
}
