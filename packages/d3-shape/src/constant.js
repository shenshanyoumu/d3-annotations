/**
 * 高阶形式
 * @param {*} x 
 */
export default function(x) {
  return function constant() {
    return x;
  };
}
