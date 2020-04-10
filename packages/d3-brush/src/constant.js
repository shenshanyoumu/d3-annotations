/**
 * d3的一个特色就是函数运算，函数运算比直接的类型操作具有的优势在于
 * 函数运算可以实现操作挂起
 * @param {*} x 
 */
export default function(x) {
  return function() {
    return x;
  };
}
