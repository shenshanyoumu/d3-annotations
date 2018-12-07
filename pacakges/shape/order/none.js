// 默认的堆叠顺序，就是给定的数据序列反向。即序列中第一个数据在堆叠图最下面
export default function(series) {
  var n = series.length,
    o = new Array(n);
  while (--n >= 0) o[n] = n;
  return o;
}
