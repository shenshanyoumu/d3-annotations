import formatDecimal from "./formatDecimal";

// 获得十进制数指数化后的指数部分
export default function(x) {
  return (x = formatDecimal(Math.abs(x))), x ? x[1] : NaN;
}
