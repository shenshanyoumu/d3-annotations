// 在d3中几乎所有的模块都采用FP编程范式来进行，对函数的操作并不需要关系函数内部状态保持
export default function(x) {
  return function() {
    return x;
  };
}
