// 注意下面函数执行后，返回一个基础线性插值器
export default function(a, b) {
  return (
    (a = +a),
    (b -= a),
    function(t) {
      return a + b * t;
    }
  );
}
