// D3几乎所有的操作都是对函数的操作，并返回另一个函数
export default function(x) {
  return function() {
    return x;
  };
}
