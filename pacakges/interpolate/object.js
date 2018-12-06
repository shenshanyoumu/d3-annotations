import value from "./value";

// 所谓对象插值器，其实就是对递归对象属性，对基础属性进行插值操作
export default function(a, b) {
  var i = {},
    c = {},
    k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = value(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  // 两个对象配对属性插值后生成一个新对象输出
  return function(t) {
    for (k in i) {
      c[k] = i[k](t);
    }
    return c;
  };
}
