var overshoot = 1.70158;

// 从JS规范上，函数体内部的backIn与外部backIn是不一样的，相当于改写了函数
// 外部的IIEF模式用于实现匿名作用域，并闭包参数overshoot
export var backIn = (function custom(s) {
  // JS规范中，将非数值型变量隐式转化为数值型
  s = +s;

  // 当时间t的值很小，出现渐出的效果；然后随着t值增大，则加速渐入
  // 可以想象的场景，就是动画片中各种"先后退然后加速前进"的效果
  function backIn(t) {
    return t * t * ((s + 1) * t - s);
  }

  backIn.overshoot = custom;

  return backIn;
})(overshoot);

export var backOut = (function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((s + 1) * t + s) + 1;
  }

  backOut.overshoot = custom;

  return backOut;
})(overshoot);

export var backInOut = (function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;

  return backInOut;
})(overshoot);
