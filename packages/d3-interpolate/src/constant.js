/**
 * 高阶函数形态下的常量保持
 * @param {*} x 
 */
export default function(x) {
  return function() {
    return x;
  };
}
