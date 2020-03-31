import exponent from "./exponent.js";

// 对step参数进行指数化处理，并比较指数部分和0的大小
export default function(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}
