/**
 * 将参数x转换为数值类型，注意下面"+"操作符对数字串会进行隐式转换
 * @param {*} x 
 */
export default function(x) {
  return x === null ? NaN : +x;
}
