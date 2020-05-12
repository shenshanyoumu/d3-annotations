// D3中存在大量的类似代码，用于实现函数的compose操作
export default function(x) {
  return function() {
    return x;
  };
}
