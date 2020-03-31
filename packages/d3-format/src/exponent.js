import formatDecimal from "./formatDecimal.js";

// 返回数值指数化后的指数部分
export default function(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
}
