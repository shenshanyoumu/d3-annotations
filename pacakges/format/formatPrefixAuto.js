import formatDecimal from "./formatDecimal";

export var prefixExponent;

// 将x指数化处理后，得到的系数字符串进行额外的处理并返回
export default function(x, p) {
  // 返回十进制数字x经过指数化后的[系数，指数]形式
  var d = formatDecimal(x, p);
  if (!d) {
    return x + "";
  }
  var coefficient = d[0],
    exponent = d[1],
    // todo：下面代码难以理解
    i =
      exponent -
      (prefixExponent =
        Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) +
      1,
    n = coefficient.length;
  return i === n
    ? coefficient
    : i > n
    ? coefficient + new Array(i - n + 1).join("0") //系数字符串补“0”字符
    : i > 0
    ? coefficient.slice(0, i) + "." + coefficient.slice(i) //将剔除小数点的系数字符串重新增加小数点
    : "0." +
      new Array(1 - i).join("0") +
      formatDecimal(x, Math.max(0, p + i - 1))[0]; //新的系数字符串
}
