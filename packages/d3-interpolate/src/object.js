import value from "./value.js";

export default function(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  // 变量可枚举属性，包括原型链上属性。这对每个属性类型调用对应的插值函数
  // 执行插值函数后生成插值器interpolator
  for (k in b) {
    if (k in a) {
      i[k] = value(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) {
      c[k] = i[k](t);
    }
    
    return c;
  };
}
