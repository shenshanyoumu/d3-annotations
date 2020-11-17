/**
 * D3偏重函数式编程思想，因此大量操作都会包装为函数进行组合
 * @param {*} x 
 */
export default function(x) {
  return function() {
    return x;
  };
}
