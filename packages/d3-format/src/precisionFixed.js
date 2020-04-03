import exponent from "./exponent.js";

// 对step参数进行指数化处理，并比较指数部分和0的大小
// step其实就是浮点精度，比如设置为0.5。则格式化后的数值与原参数的误差不超过0.5
export default function(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}
