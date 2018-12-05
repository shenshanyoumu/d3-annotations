import formatDecimal from "./formatDecimal";

export default function(x, p) {
  // 十进制数字x经过指数化处理，返回[系数，指数]
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
    exponent = d[1];

  return exponent < 0
    ? "0." + new Array(-exponent).join("0") + coefficient //当指数部分为负数，则操作系数部分来消除指数的负数形式
    : coefficient.length > exponent + 1
    ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) //当系数部分长度比指数大，同样进行处理
    : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}
