/**
 * 返回原值的高阶函数
 * @param {*} x 
 */
export default function(x) {
  return function() {
    return x;
  };
}
