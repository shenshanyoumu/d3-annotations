function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    /** 注意apply第一个参数this的指向 */
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

/** 这里面各种this方法都属于Selection类方法 */
export default function(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}
