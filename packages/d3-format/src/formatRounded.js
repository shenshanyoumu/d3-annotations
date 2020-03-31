import formatDecimal from "./formatDecimal.js";

export default function(x, p) {

  //对参数x指数化处理，其系数保留p有效小数
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];

  
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}
