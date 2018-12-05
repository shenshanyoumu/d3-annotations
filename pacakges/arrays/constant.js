// D3源码中存在大量的partial application实现,
// 主要原因是D3希望采用一种函数式编程的思维
export default function(x) {
  return function() {
    return x;
  };
}
