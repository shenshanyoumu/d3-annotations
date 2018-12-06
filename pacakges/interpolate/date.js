// 针对时间值返回的基础线性插值器
export default function(a, b) {
  var d = new Date();
  return (
    (a = +a),
    (b -= a),
    function(t) {
      return d.setTime(a + b * t), d;
    }
  );
}
