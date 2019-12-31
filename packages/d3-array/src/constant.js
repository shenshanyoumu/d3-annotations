/**
 * D3遵循函数式编程思想，因此下面currying形式
 * @param {*} x 
 */
export default function(x) {
  return function() {
    return x;
  };
}
